const mongoose = require('mongoose')

// Schema for teacher
const teacherSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'teacher',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Teacher', teacherSchema)