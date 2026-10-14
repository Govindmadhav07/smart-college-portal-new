const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Student = require('../models/Student')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
      ...req.body,
      password
    })

    res.json({
      message: 'User registered',
      user
    })
  } catch (error) {
    console.log('Registration Error:', error.message)

    res.status(500).json({
      message: 'Registration failed'
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    })

    if (
      !user ||
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      return res.status(401).json({
        message: 'Invalid login'
      })
    }

    // Get name from User first
    let name = user.name

    // If User has no name, get it from Student
    if (!name) {
      const student = await Student.findOne({
        email: user.email
      })

      if (student) {
        name = student.name

        // Also save name permanently in User
        user.name = student.name
        await user.save()
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET
    )

    res.json({
      token,
      role: user.role,
      email: user.email,
      name: name || 'Student'
    })
  } catch (error) {
    console.log('Login Error:', error.message)

    res.status(500).json({
      message: 'Login failed'
    })
  }
})

module.exports = router