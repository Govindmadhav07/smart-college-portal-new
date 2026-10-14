const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  studentEmail: String,
  subject: String,
  percentage: Number
})

module.exports = mongoose.model('Attendance', attendanceSchema)