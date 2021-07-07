const Joi = require('joi');

const userValidation = {
    id: Joi.number().min(1).required(),
    name: Joi.string().required()
}

module.exports = {userValidation}