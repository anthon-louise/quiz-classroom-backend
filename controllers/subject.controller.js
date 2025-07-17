const Subject = require('../models/subject.model')
const Student = require('../models/student.model')
const Joi = require('joi')
const codeGenerator = require('../utils/subjectCodeGenerator')

// Joi validation

// Create and Update subject body schema validation
const createUpdateSubjectBodySchema = Joi.object({
    title: Joi.string().min(4).max(16)
})

const codeBodySchema = Joi.object({
    code: Joi.string().length(7).required()
})


// Creating subject controllers

// Creating a subject
const createSubject = async (req, res) => {
    const { teacherId } = req.user

    const { error, value } = createUpdateSubjectBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { title } = value

    const existingTitle = await Subject.findOne({ title })
    if (existingTitle) {
        return res.status(409).json({ message: 'Subject title already exists' })
    }

    let code
    let existingCode
    do {
        code = codeGenerator()
        existingCode = await Subject.findOne({ code })
    } while (existingCode)

    const subject = new Subject({ title, code, teacherId })
    await subject.save()
    res.json(subject)
}

// Get all subjects of a teacher
const getAllSubjects = async (req, res) => {
    const { teacherId } = req.user
    const subjects = await Subject.find({ teacherId })
    res.json(subjects)
}

// Get a subject of a teacher
const getSubject = async (req, res) => {
    const subjectId = req.params.id
    const { teacherId } = req.user

    const subject = await Subject.findOne({ _id: subjectId, teacherId })
    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
    }
    res.json(subject)
}

// delete a subject of a teacher
const deleteSubject = async (req, res) => {
    const { teacherId } = req.user
    const subjectId = req.params.id

    const subject = await Subject.findOne({ teacherId, _id: subjectId })
    if (!subject) {
        return res.status(404).json({ message: 'No subject found' })
    }

    await subject.deleteOne()
    res.json({ message: 'Subject deleted successfully' })
}

// update a subject for a teacher
const updateSubject = async (req, res) => {
    const { teacherId } = req.user
    const subjectId = req.params.id

    const { error, value } = createUpdateSubjectBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { title } = value

    console.log(subjectId)

    const subject = await Subject.findByOneAndUpdate(
        { teacherId, _id: subjectId },
        { title },
        { new: true, runValidators: true }
    )
    if (!subject) {
        return res.status(400).json({ message: 'No subject found' })
    }
    res.json(subject)
}

// join a student to a subject
const joinSubject = async (req, res) => {
    const { studentId } = req.user
    const { error, value } = codeBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { code } = value

    const subject = await Subject.findOne({ code }).select('_id')
    if (!subject) {
        return res.status(404).json("No subject found")
    }

    const student = await Student.findById(studentId)

    const alreadyJoined = student.joinedSubjects.includes(subject._id)
    if (alreadyJoined) {
        return res.status(409).json({message: 'Already joined'})
    }

    student.joinedSubjects.push(subject._id)
    await student.save()

    res.json({message: 'Successfully joined'})
}

// get subject joined by a student
const getSubjectJoined = async (req, res) => {
    const {studentId} = req.user

    const student = await Student.findById(studentId).select('joinedSubjects')
    res.json(student)
}

// leave subject
const leaveSubject = async (req, res ) => {
    const {studentId} = req.user
    const subjectId = req.params.id

    const subject = await Subject.findById(subjectId)
    if (!subject) {
        return res.status(404).json({message: 'No subject found'})
    }

    const student = await Student.findById(studentId).select('joinedSubjects')
    if (!student.joinedSubjects.includes(subject._id)) {
        return res.status(400).json({message: 'Left already'})
    }
    
    student.joinedSubjects.pull(subject._id)
    await student.save()

    res.json({message: 'Successfully left the subject'})
}

module.exports = {
    createSubject,
    getAllSubjects,
    getSubject,
    deleteSubject,
    updateSubject,
    joinSubject,
    getSubjectJoined,
    leaveSubject
}