const mongoose = require('mongoose')

// Schema for quiz
const quizSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    choices: {
        type: [String],
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Quiz', quizSchema)