const express = require('express')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const teacherRoute = require('./routes/teacher.route')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/teachers', teacherRoute)

app.use(errorHandler)

module.exports = app