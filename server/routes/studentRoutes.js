const express = require('express')
const bcrypt = require('bcryptjs')

const Student = require('../models/Student')
const User = require('../models/User')

const router = express.Router()

// Add Student + Login Account
router.post('/', async (req, res) => {
    try {
        const { name, email, rollNo, course } = req.body

        if (!name || !email || !rollNo || !course) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        // Check existing student
        const existingStudent = await Student.findOne({ email })

        if (existingStudent) {
            return res.status(400).json({
                message: 'Student already exists'
            })
        }

        // Check existing login account
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: 'Login account already exists'
            })
        }

        // Create student record
        const student = await Student.create({
            name,
            email,
            rollNo,
            course
        })

        // Default password
        const hashedPassword = await bcrypt.hash('123456', 10)

        // Create login account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student'
        })

        res.json({
            message: 'Student and login account created',
            student,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            defaultPassword: '123456'
        })
    } catch (error) {
        console.log('Student Error:', error.message)

        res.status(500).json({
            message: 'Failed to create student'
        })
    }
})

// Get Students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch students'
        })
    }
})

// Delete Student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            })
        }

        // Delete student record
        await Student.findByIdAndDelete(req.params.id)

        // Delete associated login account
        await User.findOneAndDelete({
            email: student.email
        })

        res.json({
            message: 'Student and login account deleted'
        })
    } catch (error) {
        console.log('Delete Student Error:', error.message)

        res.status(500).json({
            message: 'Failed to delete student'
        })
    }
})

// Update Student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(student)
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update student'
        })
    }
})

module.exports = router