const jwt = require('jsonwebtoken')
const Teacher = require('../models/teacher.model')

// Check if teacher is logged-in
module.exports = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({message: 'Unauthorized!'})
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        
        const teacher = await Teacher.findById(decoded.teacherId)
        if (!teacher) {
            return res.status(404).json({message: 'Teacher not found'})
        }
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized!'})
    }
}