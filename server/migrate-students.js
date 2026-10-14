const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Student = require('./models/Student')
const User = require('./models/User')

require('dotenv').config()

async function migrateStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const students = await Student.find()

    let created = 0
    let skipped = 0

    const password = await bcrypt.hash('123456', 10)

    for (const student of students) {
      const existingUser = await User.findOne({
        email: student.email
      })

      if (existingUser) {
        skipped++
        continue
      }

      await User.create({
        name: student.name,
        email: student.email,
        password,
        role: 'student'
      })

      created++

      console.log(`Created account: ${student.email}`)
    }

    console.log('')
    console.log('Migration completed')
    console.log(`Accounts created: ${created}`)
    console.log(`Already existing: ${skipped}`)
    console.log('Default password: 123456')

    await mongoose.disconnect()
  } catch (error) {
    console.log('Migration Error:', error.message)
    process.exit(1)
  }
}

migrateStudents()