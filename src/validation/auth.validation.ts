
import * as Joi from 'joi'

const user_add_joi = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    middle_name: Joi.string(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    status: Joi.number(),
}).unknown(true);

const auth_joi = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
}).unknown(true);

const refreshToken = Joi.object({
    refreshToken: Joi.string().required()
});

export {
    auth_joi,
    user_add_joi,
    refreshToken
}