const Subject = require('../models/subject.model')
const Joi = require('joi')
const codeGenerator = require('../utils/subjectCodeGenerator')

// Joi validation

// Create and Update subject body schema validation
const createUpdateSubjectBodySchema = Joi.object({
    title: Joi.string().min(4).max(16)
})


// Creating subject controllers

// Creating a subject
const createSubject = async (req, res) => {
    const {teacherId} = req.user
    
    const {error, value} = createUpdateSubjectBodySchema.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    const {title} = value

    const existingTitle = await Subject.findOne({title})
    if (existingTitle) {
        return res.status(409).json({message: 'Subject title already exists'})
    }

    let code
    let existingCode
    do {
        code = codeGenerator()
        existingCode = await Subject.findOne({code})
    } while (existingCode)
    
    const subject = new Subject({title, code, teacherId})
    await subject.save()
    res.json(subject)
}

// Get all subjects of a teacher
const getAllSubjects = async (req, res) => {
    const {teacherId} = req.user
    const subjects = await Subject.find({teacherId})
    res.json(subjects)
}

// Get a subject of a teacher
const getSubject = async (req, res) => {
    const {subjectId} = req.params
    const {teacherId} = req.user

    const subject = await Subject.findOne({subjectId, teacherId})
    if (!subject) {
        return res.status(404).json({message: 'Subject not found'})
    }
    res.json(subject)
}

module.exports = {
    createSubject,
    getAllSubjects,
    getSubject
}