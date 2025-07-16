const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const subjectControllers = require('../controllers/subject.controller')
const validateId = require('../middleware/validateId')

// Subject routes

// creating a subject
router.post('/', auth, subjectControllers.createSubject)

// getting all the subjects for a teacher
router.get('/', auth, subjectControllers.getAllSubjects)

// getting a subject for a teacher
router.get('/:id', validateId, auth, subjectControllers.getSubject)

// deleting a subject for a teacher
router.delete('/:id', validateId, auth, subjectControllers.deleteSubject)

// updating a subject for a teacher
router.put('/:id', validateId, auth, subjectControllers.updateSubject)

module.exports = router