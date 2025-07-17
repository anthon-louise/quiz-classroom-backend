const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const subjectControllers = require('../controllers/subject.controller')
const validateId = require('../middleware/validateId')

// Subject routes

// joing a student to a subject
router.post('/join', auth, subjectControllers.joinSubject)

// get subjects joined by a student
router.get('/join', auth, subjectControllers.getSubjectJoined)

// creating a subject
router.post('/', auth, subjectControllers.createSubject)

// getting all the subjects for a teacher
router.get('/', auth, subjectControllers.getAllSubjects)

// leave from a subject
router.delete('/:id/leave', validateId, auth, subjectControllers.leaveSubject)

// getting a subject for a teacher
router.get('/:id', validateId, auth, subjectControllers.getSubject)

// deleting a subject for a teacher
router.delete('/:id', validateId, auth, subjectControllers.deleteSubject)

// updating a subject for a teacher
router.put('/:id', validateId, auth, subjectControllers.updateSubject)


module.exports = router