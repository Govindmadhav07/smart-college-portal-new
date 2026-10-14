const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  studentEmail: String,
  subject: String,
  marks: Number,
  total: Number
})

module.exports = mongoose.model('Result', resultSchema)