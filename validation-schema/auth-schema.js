const Joi = require('@hapi/joi');

export const signupSchema = (payload) => {
    const schema = Joi.object({
        password: Joi.string()
            .pattern(new RegExp('^([a-zA-Z0-9@*#]{8,15})$')),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        type: Joi.string().valid('doctor', 'patient'),
        first_name: Joi.string(),
        last_name: Joi.string(),
        address: Joi.string(),
        cell_no: Joi.string(),
    });
    return schema.validate(payload);
}

