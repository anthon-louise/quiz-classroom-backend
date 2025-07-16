const Joi = require('joi')

// Validates id parameters
module.exports = (req, res, next) => {
    const idSchema = Joi.object({
        id: Joi.string().length(24).hex().required()
    })

    const {error} = idSchema.validate(req.params)
    if (error) {
        return res.status(400).json({message: error.details[0].message, lol: 'dd'})
    }

    next()
}