const Quiz = require('../models/quiz.model')
const Subject = require('../models/subject.model')
const Joi = require('joi')

// Joi validation:

// Creating a subject body schema validation
const createSubjectBodySchema = Joi.object({
    question: Joi.string().min(3).max(40).required(),
    answer: Joi.string().min(3).max(40).required(),
    choices: Joi.array().items(Joi.string()).min(2).required()
})

// Updating a subject body schema validation
const updateSubjectBodySchema = Joi.object({
    question: Joi.string().min(3).max(40),
    answer: Joi.string().min(3).max(40),
    choices: Joi.array().items(Joi.string()).min(2)
})

// Quiz controllers

// creating a quiz
const createQuiz = async (req, res) => {
    const teacherId = req.user.teacherId
    const subjectId = req.params.id
    const { error, value } = createSubjectBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    console.log(teacherId)
    console.log(subjectId)

    const subject = await Subject.findOne({ _id: subjectId, teacherId })
    if (!subject) {
        return res.status(403).json({ message: "Not authorized to create subject" })
    }

    const { question, choices, answer } = value

    const quiz = new Quiz({ question, choices, answer, subjectId })
    await quiz.save()
    res.json(quiz)
}

// get all quizzes
const getQuizzes = async (req, res) => {
    const subjectId = req.params.id
    const teacherId = req.user.teacherId

    const subject = await Subject.findOne({ _id: subjectId, teacherId })
    if (!subject) {
        return res.status(403).json({ message: "Subject doesnt exist" })
    }

    const quizzes = await Quiz.find({ subjectId })
    res.json(quizzes)
}

// get a quiz
const getQuiz = async (req, res) => {
    const quizId = req.params.id
    const teacherId = req.user.teacherId

    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        return res.status(403).json({ message: 'No quiz found' })
    }

    const subject = await Subject.findOne({ _id: quiz.subjectId, teacherId })
    if (!subject) {
        return res.status(404).json({ message: 'Not authorized for this quiz' })
    }
    res.json(quiz)
}

// delete a quiz
const deleteQuiz = async (req, res) => {
    const { teacherId } = req.user
    const quizId = req.params.id

    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        return res.status(404).json({ message: 'No quiz found' })
    }

    const subject = await Subject.findOne({ _id: quiz.subjectId, teacherId })
    if (!subject) {
        return res.status(404).json({ message: 'Not authorized for this quiz' })
    }

    await quiz.deleteOne()
    res.json({ message: 'Quiz deleted success' })
}

// update a quiz
const updateQuiz = async (req, res) => {
    const quizId = req.params.id
    const { teacherId } = req.user

    const {error, value} = updateSubjectBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    const {answer, question, choices} = value

    const quiz = await Quiz.findById(quizId).populate('subjectId')
    if (!quiz) {
        return res.status(404).json("Quiz not found")
    }
    if (!quiz.subjectId || quiz.subjectId.teacherId.toString() !== teacherId) {
        return res.status(403).json({ message: 'Not authorized' })
    }

    quiz.answer = answer || quiz.answer
    quiz.question = question || quiz.question
    quiz.choices = choices || quiz.choices

    await quiz.save()
    res.json(quiz)
}

module.exports = {
    createQuiz,
    getQuizzes,
    getQuiz,
    deleteQuiz,
    updateQuiz
}