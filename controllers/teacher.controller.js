const Teacher = require('../models/teacher.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

// Joi validation:

// teacher signup body schema validation
const teacherSignupBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3).required()
})

// teacher login body schema validation
const teacherLoginBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
})

// teacher update body schema validation
const teacherUpdateBodySchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(3)
})

// Teacher controllers:

// Signup for teacher
const teacherSignup = async (req, res) => {
    const { error, value } = teacherSignupBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password, name } = value

    const existingEmail = await Teacher.findOne({ email })
    if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const teacher = new Teacher({ email, password: hashedPassword, name, role: 'teacher' })
    await teacher.save()
    res.json({ message: 'Teacher signup success' })
}

// Login for teacher
const teacherLogin = async (req, res) => {
    const { error, value } = teacherLoginBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const {email, password} = value

    const teacher = await Teacher.findOne({email})
    if (!teacher) {
        return res.status(400).json({message: 'Teacher does not exist'})
    }

    const isValid = await bcrypt.compare(password, teacher.password)
    if (!isValid) {
        return res.status(400).json({message: 'Invalid password'})
    }

    const token = jwt.sign(
        {teacherId: teacher._id, role: teacher.role},
        process.env.SECRET,
        {expiresIn: '1h'}
    )

    res.cookie('token', token, {
        sameSite: 'strict',
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    })

    res.json({message: 'Teacher login success'})
}

// Get teachet information
const getTeacherProfile = async (req, res) => {
    const {teacherId} = req.user
    const teacherProfile = await Teacher.findById(teacherId).select('name email')
    res.json({teacherProfile, message: 'Teacher profile fetched'})
}

// Update teacher information
const updateTeacherProfile = async (req, res) => {
    const {teacherId} = req.user

    const {error, value} = teacherUpdateBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    const {email, name} = value

    const existingTeacher = await Teacher.findOne({email})
    if (existingTeacher && existingTeacher._id.toString() !== teacherId) {
        return res.status(409).json({message: 'Email exists already'})
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        {email, name},
        {new: true, runValidators: true}
    )
    if (!updatedTeacher) {
        return res.status(404).json({message: 'No teacher found'})
    }

    res.json({message: 'Update success'})
}

// Delete teacher account
const deleteTeacherAccount = async (req, res) => {
    const {userId} = req.user
    await Teacher.findByIdAndDelete(userId)
    res.json({message: 'Teacher account deleted successfully'})
}

module.exports = {
    teacherSignup,
    teacherLogin,
    getTeacherProfile,
    updateTeacherProfile,
    deleteTeacherAccount
}