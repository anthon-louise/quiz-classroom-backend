const express = require('express')
const router = express.Router()
const teacherControllers = require('../controllers/teacher.controller')
const auth = require('../middleware/auth')

// Teacher routes:

// signup for teacher
router.post('/signup', teacherControllers.teacherSignup)

// login for teacher
router.post('/login', teacherControllers.teacherLogin)

// Get teacher information
router.get('/profile', auth, teacherControllers.getTeacherProfile)

// Update teacher information
router.put('/profile', auth, teacherControllers.updateTeacherProfile)

// Delete teacher account
router.delete('/profile', auth, teacherControllers.deleteTeacherAccount)

module.exports = router