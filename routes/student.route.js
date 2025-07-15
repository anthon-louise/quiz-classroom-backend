const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const studentControllers = require('../controllers/student.controller')

// Student routes:

// signup for students
router.post('/signup', studentControllers.studentSignup)

// login for students
router.post('/login', studentControllers.studentLogin)

// get student infomation
router.get('/profile', auth, studentControllers.getStudentProfile)

// update student information
router.put('/profile', auth, studentControllers.updateStudentProfile)

// delete student information
router.delete('/profile', auth, studentControllers.deleteStudentAccount)

module.exports = router