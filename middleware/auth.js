const jwt = require('jsonwebtoken')
const Teacher = require('../models/teacher.model')
const Student = require('../models/student.model')

// Check if teacher or student is logged-in
module.exports = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET)

        if (decoded.role === 'teacher') {
            const teacher = await Teacher.findById(decoded.teacherId)
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' })
            }
        } else {
            const student = await Student.findById(decoded.studentId)
            if (!student) {
                return res.status(404).json({ message: 'Student not found' })
            }
        }
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized!' })
    }
}