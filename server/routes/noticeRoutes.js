const express = require('express')
const Notice = require('../models/Notice')

const router = express.Router()

// ADD NOTICE
router.post('/', async (req, res) => {
    try {
        const notice = await Notice.create({
            title: req.body.title,
            details: req.body.details
        })

        res.status(201).json(notice)
    } catch (error) {
        console.log('Add Notice Error:', error)

        res.status(500).json({
            message: 'Failed to add notice'
        })
    }
})

// GET NOTICES
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find()
            .sort({ createdAt: -1 })

        res.json(notices)
    } catch (error) {
        console.log('Get Notices Error:', error)

        res.status(500).json({
            message: 'Failed to get notices'
        })
    }
})

// UPDATE NOTICE
router.put('/:id', async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                details: req.body.details
            },
            {
                new: true
            }
        )

        if (!notice) {
            return res.status(404).json({
                message: 'Notice not found'
            })
        }

        res.json(notice)
    } catch (error) {
        console.log('Update Notice Error:', error)

        res.status(500).json({
            message: 'Failed to update notice'
        })
    }
})

// DELETE NOTICE
router.delete('/:id', async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(
            req.params.id
        )

        if (!notice) {
            return res.status(404).json({
                message: 'Notice not found'
            })
        }

        res.json({
            message: 'Notice deleted'
        })
    } catch (error) {
        console.log('Delete Notice Error:', error)

        res.status(500).json({
            message: 'Failed to delete notice'
        })
    }
})

module.exports = router