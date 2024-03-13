import * as express from "express";
import { createValidator } from "express-joi-validation";
import { auth_joi, refreshToken} from '../validation/auth.validation';
import { AuthController } from "../controllers/auth.controller";
import {checkToken} from "../utils/check-token.service";

const validator = createValidator({ passError: true });

export const authRoutes = (app: express.Application) => {

    app.post('/login', validator.body(auth_joi), AuthController.login);
    app.post('/refresh-token', validator.body(refreshToken), AuthController.refresh);
    app.post('/logout', checkToken, validator.body(refreshToken), AuthController.logout);

}