const express = require('express')
const Attendance = require('../models/Attendance')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance({
      studentEmail: req.body.studentEmail,
      subject: req.body.subject,
      percentage: Number(req.body.percentage)
    })

    const savedAttendance = await attendance.save()

    console.log('SAVED:', savedAttendance)

    res.status(201).json(savedAttendance)
  } catch (error) {
    console.log('SAVE ERROR:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const data = req.query.email
      ? await Attendance.find({
          studentEmail: req.query.email
        })
      : await Attendance.find()

    console.log('GET ATTENDANCE:', data)

    res.status(200).json(data)
  } catch (error) {
    console.log('GET ERROR:', error)

    res.status(500).json({
      message: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const attendance =
      await Attendance.findByIdAndUpdate(
        req.params.id,
        {
          percentage: Number(req.body.percentage)
        },
        { new: true }
      )

    res.json(attendance)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Attendance deleted'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router