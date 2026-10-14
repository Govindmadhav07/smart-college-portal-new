const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  dueDate: String
})

module.exports = mongoose.model('Assignment', assignmentSchema)