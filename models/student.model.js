const mongoose = require('mongoose')

// Schema for students
const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'student'
    },
    joinedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]

}, {
    timestamps: true
})

module.exports = mongoose.model('Student', studentSchema)