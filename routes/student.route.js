const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const studentControllers = require('../controllers/student.controller')

router.post('/signup', studentControllers.studentSignup)
router.post('/login', studentControllers.studentLogin)

module.exports = router