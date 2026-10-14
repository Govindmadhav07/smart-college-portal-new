
const mongoose = require('mongoose')

const feePaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentId: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      enum: ['Online', 'Cash', 'Bank Transfer', 'Other'],
      default: 'Online'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    paidAt: {
      type: Date,
      default: null
    },
    receiptNo: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

const feeSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    studentName: {
      type: String,
      required: true
    },
    rollNo: {
      type: String,
      default: ''
    },
    course: {
      type: String,
      default: ''
    },
    academicYear: {
      type: String,
      required: true,
      default: '2026-27'
    },
    totalFees: {
      type: Number,
      required: true,
      min: 0
    },
    payments: {
      type: [feePaymentSchema],
      default: []
    }
  },
  { timestamps: true }
)

feeSchema.index(
  { studentEmail: 1, academicYear: 1 },
  { unique: true }
)

module.exports = mongoose.model('Fee', feeSchema)
