const express = require('express')
const Result = require('../models/Result')

const router = express.Router()

// ADD RESULT
router.post('/', async (req, res) => {
  try {
    const result = await Result.create({
      studentEmail: req.body.studentEmail,
      subject: req.body.subject,
      marks: Number(req.body.marks),
      total: Number(req.body.total)
    })

    console.log('Result Saved:', result)

    res.status(201).json(result)
  } catch (error) {
    console.log('Add Result Error:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

// GET RESULTS
router.get('/', async (req, res) => {
  try {
    let results

    if (req.query.email) {
      results = await Result.find({
        studentEmail: req.query.email
      })
    } else {
      results = await Result.find({
        studentEmail: { $exists: true, $ne: '' },
        subject: { $exists: true, $ne: '' },
        marks: { $exists: true },
        total: { $exists: true }
      })
    }

    res.json(results)
  } catch (error) {
    console.log('Get Results Error:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

// UPDATE RESULT
router.put('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        marks: Number(req.body.marks)
      },
      {
        new: true
      }
    )

    if (!result) {
      return res.status(404).json({
        message: 'Result not found'
      })
    }

    res.json(result)
  } catch (error) {
    console.log('Update Result Error:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

// DELETE RESULT
router.delete('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(
      req.params.id
    )

    if (!result) {
      return res.status(404).json({
        message: 'Result not found'
      })
    }

    console.log('Result Deleted:', result._id)

    res.json({
      message: 'Result deleted'
    })
  } catch (error) {
    console.log('Delete Result Error:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router