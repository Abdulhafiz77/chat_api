import * as express from 'express';
import { createValidator } from "express-joi-validation";
import { checkToken } from "../utils/check-token.service";
import { ChatController } from "../controllers/chat.controller";
import { chatData } from "../validation/chat.validate";
import { room } from "../validation/chat.validate";

const validator = createValidator({ passError: true });

export const chatRoutes = (app: express.Application) => {

    app.post('/', checkToken, validator.body(chatData), ChatController.create);
    app.get('/', checkToken, ChatController.list);
    app.get('/:room', checkToken, validator.params(room), ChatController.getChat);

}