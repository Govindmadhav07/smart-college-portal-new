
const mongoose = require('mongoose')

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    studentName: {
      type: String,
      required: true
    },
    rollNo: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Submitted', 'Checked'],
      default: 'Submitted'
    },
    marks: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

assignmentSubmissionSchema.index(
  { assignmentId: 1, studentEmail: 1 },
  { unique: true }
)

module.exports = mongoose.model(
  'AssignmentSubmission',
  assignmentSubmissionSchema
)
