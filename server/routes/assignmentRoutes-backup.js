const express = require('express')
const Assignment = require('../models/Assignment')

const router = express.Router()

// ADD ASSIGNMENT
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
        console.log('Add Assignment Error:', error)

        res.status(500).json({
            message: 'Failed to add assignment',
            error: error.message
        })
    }
})

// GET ASSIGNMENTS
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find()

        res.json(assignments)
    } catch (error) {
        console.log('Get Assignment Error:', error)

        res.status(500).json({
            message: 'Failed to get assignments',
            error: error.message
        })
    }
})

// UPDATE ASSIGNMENT
router.put('/:id', async (req, res) => {
    try {
        const assignment =
            await Assignment.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    subject: req.body.subject,
                    description: req.body.description,
                    dueDate: req.body.dueDate
                },
                {
                    new: true,
                    runValidators: true
                }
            )

        if (!assignment) {
            return res.status(404).json({
                message: 'Assignment not found'
            })
        }

        res.json(assignment)
    } catch (error) {
        console.log('Update Assignment Error:', error)

        res.status(500).json({
            message: 'Failed to update assignment',
            error: error.message
        })
    }
})

// DELETE ASSIGNMENT
router.delete('/:id', async (req, res) => {
    try {
        console.log(
            'DELETE ASSIGNMENT:',
            req.params.id
        )

        const assignment =
            await Assignment.findByIdAndDelete(
                req.params.id
            )

        if (!assignment) {
            return res.status(404).json({
                message: 'Assignment not found'
            })
        }

        console.log(
            'DELETED:',
            assignment._id
        )

        res.status(200).json({
            message: 'Assignment deleted successfully',
            id: assignment._id
        })
    } catch (error) {
        console.log(
            'Delete Assignment Error:',
            error
        )

        res.status(500).json({
            message: 'Failed to delete assignment',
            error: error.message
        })
    }
})

module.exports = router