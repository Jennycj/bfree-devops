const Joi = require('joi');

const validator = (obj) => {
    return (req, res, next) => {
        const schema = Joi.object().keys(obj).required().unknown(false);
        const value = req.method !== "POST" ? req.query : req.body;
        const { error } = schema.validate(value);

        if (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            });
        }
        next();
    }
}

module.exports = {validator}