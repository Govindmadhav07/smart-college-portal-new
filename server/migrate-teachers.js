const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Teacher = require('./models/Teacher')
const User = require('./models/User')

require('dotenv').config()

async function migrateTeachers() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const teachers = await Teacher.find()

    let created = 0
    let skipped = 0

    const password = await bcrypt.hash('123456', 10)

    for (const teacher of teachers) {
      const existingUser = await User.findOne({
        email: teacher.email
      })

      if (existingUser) {
        skipped++
        continue
      }

      await User.create({
        name: teacher.name,
        email: teacher.email,
        password,
        role: 'teacher'
      })

      created++

      console.log(
        `Created teacher account: ${teacher.email}`
      )
    }

    console.log('')
    console.log('Teacher migration completed')
    console.log(`Accounts created: ${created}`)
    console.log(`Already existing: ${skipped}`)
    console.log('Default password: 123456')

    await mongoose.disconnect()
  } catch (error) {
    console.log(
      'Teacher Migration Error:',
      error.message
    )

    process.exit(1)
  }
}

migrateTeachers()