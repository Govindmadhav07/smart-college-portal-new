
const express = require('express')
const mongoose = require('mongoose')
const crypto = require('crypto')
const Razorpay = require('razorpay')
const jwt = require('jsonwebtoken')

const Fee = require('../models/Fee')
const Student = require('../models/Student')

const router = express.Router()

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first' })
  }

  try {
    req.user = jwt.verify(
      authHeader.split(' ')[1],
      process.env.JWT_SECRET
    )
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }
}

function getRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error('Razorpay API keys are missing in server/.env')
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

function getBalance(fee) {
  const paid = fee.payments
    .filter(payment => payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    paid,
    balance: Math.max(0, fee.totalFees - paid)
  }
}

// Admin: view all fee records
router.get(
  '/',
  authenticate,
  allowRoles('admin'),
  async (req, res) => {
    try {
      const fees = await Fee.find().sort({ studentName: 1 })
      res.json(
        fees.map(fee => ({
          ...fee.toObject(),
          ...getBalance(fee)
        }))
      )
    } catch (error) {
      console.error('Fee list error:', error.message)
      res.status(500).json({ message: 'Could not load fee records' })
    }
  }
)

// Admin: set or update a student's total fees
router.post(
  '/',
  authenticate,
  allowRoles('admin'),
  async (req, res) => {
    try {
      const { studentEmail, totalFees, academicYear } = req.body

      if (
        !studentEmail ||
        !Number.isFinite(Number(totalFees)) ||
        Number(totalFees) < 0
      ) {
        return res.status(400).json({
          message: 'Valid student email and total fees are required'
        })
      }

      const email = studentEmail.trim().toLowerCase()
      const student = await Student.findOne({ email })

      if (!student) {
        return res.status(404).json({ message: 'Student not found' })
      }

      const year = academicYear || '2026-27'

      let fee = await Fee.findOne({
        studentEmail: email,
        academicYear: year
      })

      if (fee) {
        const paid = getBalance(fee).paid

        if (Number(totalFees) < paid) {
          return res.status(400).json({
            message: 'Total fees cannot be less than fees already paid'
          })
        }

        fee.totalFees = Number(totalFees)
        fee.studentName = student.name
        fee.rollNo = student.rollNo || ''
        fee.course = student.course || ''
        await fee.save()
      } else {
        fee = await Fee.create({
          studentEmail: email,
          studentName: student.name,
          rollNo: student.rollNo || '',
          course: student.course || '',
          academicYear: year,
          totalFees: Number(totalFees)
        })
      }

      res.status(200).json({
        message: 'Fees saved successfully',
        fee: {
          ...fee.toObject(),
          ...getBalance(fee)
        }
      })
    } catch (error) {
      console.error('Save fee error:', error.message)
      res.status(500).json({ message: 'Could not save fees' })
    }
  }
)

// Student: view own fee record
router.get(
  '/mine',
  authenticate,
  allowRoles('student'),
  async (req, res) => {
    try {
      const email = String(req.user.email || '').toLowerCase()
      const year = req.query.academicYear || '2026-27'

      const fee = await Fee.findOne({
        studentEmail: email,
        academicYear: year
      })

      if (!fee) {
        return res.json({
          fee: null,
          message: 'Fees have not been assigned yet'
        })
      }

      res.json({
        fee: {
          ...fee.toObject(),
          ...getBalance(fee)
        }
      })
    } catch (error) {
      console.error('Student fee error:', error.message)
      res.status(500).json({ message: 'Could not load your fees' })
    }
  }
)

// Student: create Razorpay order for a partial or full payment
router.post(
  '/create-order',
  authenticate,
  allowRoles('student'),
  async (req, res) => {
    try {
      const email = String(req.user.email || '').toLowerCase()
      const amount = Number(req.body.amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Enter a valid amount' })
      }

      const fee = await Fee.findOne({
        studentEmail: email,
        academicYear: req.body.academicYear || '2026-27'
      })

      if (!fee) {
        return res.status(404).json({ message: 'Fee record not found' })
      }

      const { balance } = getBalance(fee)

      if (balance <= 0 || amount > balance) {
        return res.status(400).json({
          message: 'Payment amount exceeds the remaining balance'
        })
      }

      const razorpay = getRazorpay()

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `fee_${new mongoose.Types.ObjectId().toString()}`
      })

      fee.payments.push({
        amount,
        orderId: order.id,
        method: 'Online',
        status: 'Pending'
      })

      await fee.save()

      res.json({
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        studentName: fee.studentName,
        studentEmail: fee.studentEmail
      })
    } catch (error) {
      console.error('Create payment order error:', error.message)
      res.status(500).json({ message: 'Could not create payment order' })
    }
  }
)

// Student: verify successful Razorpay Checkout payment
router.post(
  '/verify-payment',
  authenticate,
  allowRoles('student'),
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          message: 'Payment verification details are incomplete'
        })
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      const received = Buffer.from(razorpay_signature, 'hex')
      const expected = Buffer.from(expectedSignature, 'hex')

      if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(received, expected)
      ) {
        return res.status(400).json({
          message: 'Payment signature verification failed'
        })
      }

      const email = String(req.user.email || '').toLowerCase()

      const fee = await Fee.findOne({
        studentEmail: email,
        'payments.orderId': razorpay_order_id
      })

      if (!fee) {
        return res.status(404).json({
          message: 'Matching payment order not found'
        })
      }

      const payment = fee.payments.find(
        item => item.orderId === razorpay_order_id
      )

      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' })
      }

      if (payment.status === 'Paid') {
        return res.json({
          message: 'Payment was already verified',
          ...getBalance(fee)
        })
      }

      // Confirm the order and payment with Razorpay before marking paid.
      const razorpay = getRazorpay()
      const [order, paymentDetails] = await Promise.all([
        razorpay.orders.fetch(razorpay_order_id),
        razorpay.payments.fetch(razorpay_payment_id)
      ])

      if (
        order.status !== 'paid' ||
        paymentDetails.order_id !== razorpay_order_id ||
        paymentDetails.status !== 'captured' ||
        paymentDetails.amount !== Math.round(payment.amount * 100) ||
        order.amount !== Math.round(payment.amount * 100) ||
        order.currency !== 'INR' ||
        paymentDetails.currency !== 'INR'
      ) {
        return res.status(400).json({
          message: 'Payment is not captured or the amount does not match'
        })
      }

      payment.paymentId = razorpay_payment_id
      payment.status = 'Paid'
      payment.paidAt = new Date()
      payment.receiptNo = `FEE-${razorpay_payment_id}`

      await fee.save()

      res.json({
        message: 'Payment verified successfully',
        receiptNo: payment.receiptNo,
        ...getBalance(fee)
      })
    } catch (error) {
      console.error('Verify payment error:', error.message)
      res.status(500).json({
        message: 'Payment verification failed. Please check payment status.'
      })
    }
  }
)

module.exports = router
