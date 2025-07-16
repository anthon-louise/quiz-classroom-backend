const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const validateId = require('../middleware/validateId')
const quizControllers = require('../controllers/quiz.controller')

// Routes for quizzes:

// create quiz
router.post('/:id/subject', auth, validateId, quizControllers.createQuiz)

// get all quizzes
router.get('/:id/subject',auth, validateId, quizControllers.getQuizzes)

// get a quiz
router.get('/:id', auth, validateId, quizControllers.getQuiz)

// delete a quiz
router.delete('/:id', auth, validateId, quizControllers.deleteQuiz)

// update a quiz
router.put('/:id', auth, validateId, quizControllers.updateQuiz)

module.exports = router