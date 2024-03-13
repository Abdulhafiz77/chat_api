import * as Joi from "joi";

const messageDataSchema = Joi.object({
    interlocutorId: Joi.number().required(),
    room: Joi.string().uuid().required(),
    message: Joi.string().required(),
    status: Joi.number()
})

const fileDataSchema = Joi.object({
    interlocutorId: Joi.number().required(),
    room: Joi.string().uuid().required(),
    extension: Joi.string(),
    status: Joi.number(),
    file: Joi.any()
})

export { messageDataSchema, fileDataSchema };