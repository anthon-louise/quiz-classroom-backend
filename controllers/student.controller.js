const Student = require('../models/student.model')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Joi validation

// Student signup schema validation
const studentSignupBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3).required()
})

// Student login schema validation
const studentLoginBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
})

// Student update body schema validation
const studentUpdateBodySchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(1)
})


// Student controllers:

// signup for students
const studentSignup = async (req, res) => {
    const { error, value } = studentSignupBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password, name } = value

    const existingStudent = await Student.findOne({ email })
    if (existingStudent) {
        return res.status(409).json({ message: 'Student email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const teacher = await Student({ email, password: hashedPassword, name, role: 'student' })
    teacher.save()

    res.json({ message: 'Signup student success' })
}

// login for students
const studentLogin = async (req, res) => {
    const { error, value } = studentLoginBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password } = value

    const student = await Student.findOne({ email })
    if (!student) {
        return res.status(404).json({ message: 'Student email not found' })
    }

    const isValid = await bcrypt.compare(password, student.password)
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
        { studentId: student._id, role: student.role },
        process.env.SECRET,
        { expiresIn: '1h' }
    )

    res.cookie('token', token, {
        sameSite: 'strict',
        httpOnly: true,
        secure: false,
        maxAge: 3600000
    })

    res.json({message: 'Student login success'})
}

// Get student information
const getStudentProfile = async (req, res) => {
    const {studentId} = req.user

    const studentProfile = await Student.findById(studentId).select('name email role')
    res.json({studentProfile, message: 'Student profile fetched'})
}

// Update student profile
const updateStudentProfile = async (req, res) => {
    const {studentId} = req.user

    const {error, value} = studentUpdateBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    const {email, name} = value

    const existingStudent = await Student.findOne({email})
    if (existingStudent && existingStudent._id.toString() !== studentId) {
        return res.status(400).json({message: 'Email already exists'})
    }

    const student = await Student.findByIdAndUpdate(
        studentId,
        {email, name},
        {new: true, runValidators: true}
    )

    res.json(student)
}

// Delete student account
const deleteStudentAccount = async (req, res) => {
    const {studentId} = req.user
    await Student.findByIdAndDelete(studentId)
    res.json({message: 'Account deleted'})
}

module.exports = {
    studentSignup,
    studentLogin,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentAccount
}