const express = require('express')
const bcrypt = require('bcryptjs')

const Teacher = require('../models/Teacher')
const User = require('../models/User')

const router = express.Router()

// Add Teacher + Login Account
router.post('/', async (req, res) => {
  try {
    const { name, email, subject } = req.body

    if (!name || !email || !subject) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    // Check existing teacher
    const existingTeacher = await Teacher.findOne({
      email
    })

    if (existingTeacher) {
      return res.status(400).json({
        message: 'Teacher already exists'
      })
    }

    // Check existing login account
    const existingUser = await User.findOne({
      email
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Login account already exists'
      })
    }

    // Create teacher record
    const teacher = await Teacher.create({
      name,
      email,
      subject
    })

    // Create login account
    const hashedPassword = await bcrypt.hash(
      '123456',
      10
    )

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher'
    })

    res.json({
      message: 'Teacher and login account created',
      teacher,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      defaultPassword: '123456'
    })
  } catch (error) {
    console.log('Add Teacher Error:', error.message)

    res.status(500).json({
      message: 'Failed to create teacher'
    })
  }
})

// Get Teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.json(teachers)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch teachers'
    })
  }
})

// Update Teacher
router.put('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher not found'
      })
    }

    // Keep login account name in sync
    if (req.body.name) {
      await User.findOneAndUpdate(
        { email: teacher.email },
        { name: req.body.name }
      )
    }

    res.json(teacher)
  } catch (error) {
    console.log('Update Teacher Error:', error.message)

    res.status(500).json({
      message: 'Failed to update teacher'
    })
  }
})

// Delete Teacher + Login Account
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.params.id
    )

    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher not found'
      })
    }

    // Delete teacher record
    await Teacher.findByIdAndDelete(req.params.id)

    // Delete login account
    await User.findOneAndDelete({
      email: teacher.email
    })

    res.json({
      message: 'Teacher and login account deleted'
    })
  } catch (error) {
    console.log('Delete Teacher Error:', error.message)

    res.status(500).json({
      message: 'Failed to delete teacher'
    })
  }
})

module.exports = router