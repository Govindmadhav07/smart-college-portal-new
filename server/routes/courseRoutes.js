const express = require('express')
const Course = require('../models/Course')

const router = express.Router()

router.post('/', async (req, res) => {
  const course = await Course.create(req.body)
  res.json(course)
})

router.get('/', async (req, res) => {
  const courses = await Course.find()
  res.json(courses)
})

module.exports = router
router.put('/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  )
  res.json(course)
})

router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id)
  res.json({ message: 'Course deleted' })
})