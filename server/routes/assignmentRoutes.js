
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Assignment = require('../models/Assignment')
const AssignmentSubmission = require('../models/AssignmentSubmission')
const Student = require('../models/Student')

const router = express.Router()

// Authentication
const authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization

        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Please login first' })
        }

        req.user = jwt.verify(
            header.slice(7),
            process.env.JWT_SECRET
        )

        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

const allowRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' })
    }
    next()
}

// Upload storage
const uploadDir = path.join(__dirname, '../uploads/assignments')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${crypto.randomUUID()}${ext}`)
    }
})

const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Only PDF, DOC, DOCX, JPG and PNG files are allowed'))
        }
        cb(null, true)
    }
})

// Add assignment
router.post('/', async (req, res) => {
    try {
        const assignment = await Assignment.create({
            title: req.body.title,
            subject: req.body.subject,
            description: req.body.description,
            dueDate: req.body.dueDate
        })
        res.status(201).json(assignment)
    } catch (error) {
        res.status(500).json({ message: 'Failed to add assignment' })
    }
})

// Get assignments
router.get('/', async (req, res) => {
    try {
        res.json(await Assignment.find())
    } catch {
        res.status(500).json({ message: 'Failed to get assignments' })
    }
})

// Student submits a file
router.post(
    '/:id/submit',
    authenticate,
    allowRoles('student'),
    (req, res, next) => {
        upload.single('file')(req, res, error => {
            if (error) {
                return res.status(400).json({ message: error.message })
            }
            next()
        })
    },
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please select a file' })
            }

            if (!mongoose.isValidObjectId(req.params.id)) {
                fs.unlinkSync(req.file.path)
                return res.status(400).json({ message: 'Invalid assignment ID' })
            }

            const assignment = await Assignment.findById(req.params.id)
            if (!assignment) {
                fs.unlinkSync(req.file.path)
                return res.status(404).json({ message: 'Assignment not found' })
            }

            if (
                assignment.dueDate &&
                new Date(`${assignment.dueDate}T23:59:59`) < new Date()
            ) {
                fs.unlinkSync(req.file.path)
                return res.status(400).json({ message: 'Submission deadline has passed' })
            }

            const email = String(req.user.email).toLowerCase()
            const student = await Student.findOne({ email })

            if (!student) {
                fs.unlinkSync(req.file.path)
                return res.status(404).json({ message: 'Student record not found' })
            }

            const existing = await AssignmentSubmission.findOne({
                assignmentId: assignment._id,
                studentEmail: email
            })

            const submission = await AssignmentSubmission.findOneAndUpdate(
                { assignmentId: assignment._id, studentEmail: email },
                {
                    assignmentId: assignment._id,
                    studentEmail: email,
                    studentName: student.name,
                    rollNo: student.rollNo || '',
                    fileName: req.file.originalname,
                    filePath: req.file.filename,
                    submittedAt: new Date(),
                    status: 'Submitted',
                    marks: null,
                    feedback: ''
                },
                { new: true, upsert: true, runValidators: true }
            )

            if (existing?.filePath) {
                const oldPath = path.join(uploadDir, path.basename(existing.filePath))
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
            }

            res.status(201).json({
                message: 'Assignment submitted successfully',
                submission: {
                    _id: submission._id,
                    fileName: submission.fileName,
                    submittedAt: submission.submittedAt,
                    status: submission.status
                }
            })
        } catch (error) {
            if (req.file?.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path)
            }
            console.error('Submission error:', error.message)
            res.status(500).json({ message: 'Failed to submit assignment' })
        }
    }
)

// Student views own submission
router.get(
    '/:id/my-submission',
    authenticate,
    allowRoles('student'),
    async (req, res) => {
        try {
            const submission = await AssignmentSubmission.findOne({
                assignmentId: req.params.id,
                studentEmail: String(req.user.email).toLowerCase()
            }).select('-filePath')

            res.json(submission)
        } catch {
            res.status(500).json({ message: 'Failed to load submission' })
        }
    }
)

// Teacher/admin views submissions
router.get(
    '/:id/submissions',
    authenticate,
    allowRoles('teacher', 'admin'),
    async (req, res) => {
        try {
            const submissions = await AssignmentSubmission.find({
                assignmentId: req.params.id
            }).select('-filePath').sort({ submittedAt: -1 })

            res.json(submissions)
        } catch {
            res.status(500).json({ message: 'Failed to load submissions' })
        }
    }
)

// Download submission file
router.get(
    '/submissions/:submissionId/file',
    authenticate,
    async (req, res) => {
        try {
            const submission = await AssignmentSubmission.findById(
                req.params.submissionId
            )

            if (!submission) {
                return res.status(404).json({ message: 'Submission not found' })
            }

            const isOwner =
                req.user.role === 'student' &&
                String(req.user.email).toLowerCase() === submission.studentEmail

            const canReview = ['teacher', 'admin'].includes(req.user.role)

            if (!isOwner && !canReview) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const filePath = path.join(
                uploadDir,
                path.basename(submission.filePath)
            )

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Uploaded file not found' })
            }

            res.download(filePath, submission.fileName)
        } catch {
            res.status(500).json({ message: 'Failed to download file' })
        }
    }
)

// Teacher saves marks and feedback
router.put(
    '/submissions/:submissionId/review',
    authenticate,
    allowRoles('teacher', 'admin'),
    async (req, res) => {
        try {
            const { marks, feedback } = req.body

            if (
                marks !== null &&
                marks !== undefined &&
                marks !== '' &&
                (!Number.isFinite(Number(marks)) || Number(marks) < 0)
            ) {
                return res.status(400).json({
                    message: 'Marks must be a non-negative number'
                })
            }

            const submission = await AssignmentSubmission.findByIdAndUpdate(
                req.params.submissionId,
                {
                    marks: marks === '' || marks === undefined ? null : marks,
                    feedback: feedback || '',
                    status: 'Checked'
                },
                { new: true, runValidators: true }
            ).select('-filePath')

            if (!submission) {
                return res.status(404).json({ message: 'Submission not found' })
            }

            res.json({ message: 'Review saved', submission })
        } catch {
            res.status(500).json({ message: 'Failed to save review' })
        }
    }
)

// Edit assignment
router.put('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                subject: req.body.subject,
                description: req.body.description,
                dueDate: req.body.dueDate
            },
            { new: true, runValidators: true }
        )

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' })
        }

        res.json(assignment)
    } catch {
        res.status(500).json({ message: 'Failed to update assignment' })
    }
})

// Delete assignment
router.delete('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id)

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' })
        }

        res.json({ message: 'Assignment deleted successfully' })
    } catch {
        res.status(500).json({ message: 'Failed to delete assignment' })
    }
})

router.get(
    '/report',
    authenticate,
    allowRoles('teacher', 'admin'),
    async (req, res) => {
        try {
            const submissions = await AssignmentSubmission.find()
                .populate('assignmentId', 'title subject dueDate')
                .select('-filePath')
                .sort({ submittedAt: -1 })

            const report = submissions.map(s => ({
                _id: s._id,
                studentName: s.studentName,
                studentEmail: s.studentEmail,
                rollNo: s.rollNo,
                assignmentTitle: s.assignmentId?.title || 'Assignment deleted',
                subject: s.assignmentId?.subject || '',
                marks: s.marks,
                feedback: s.feedback,
                status: s.status,
                submittedAt: s.submittedAt
            }))

            res.json(report)
        } catch (error) {
            console.error('Marks Report Error:', error.message)
            res.status(500).json({
                message: 'Failed to load marks report'
            })
        }
    }
)

module.exports = router
