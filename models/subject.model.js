const mongoose = require('mongoose')

// Schema for subject
const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    code: {
        type: String,
        require: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        require
    }
}) 

module.exports = mongoose.model('Subject', subjectSchema)