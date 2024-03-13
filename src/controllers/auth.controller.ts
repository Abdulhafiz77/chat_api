import { JwtService } from './../utils/jwt.service';
import { IValidatedRequest } from "../models/request/validatedRequest.model";
import { IValidatedRequestBody } from "../models/request/validatedRequestBody.model";
import {ILogin, IRefreshToken, IUserAuth} from "../models/interfaces/auth.model";
import { AuthRepository } from "../repository/auth.repository";
import { ErrorService } from "../utils/error.service";
import { ErrorEnum } from "../models/enums/error.enum";
import StatusCodes, { CONFLICT } from "http-status-codes";
import { PasswordService, redisClient } from '../utils';

export class AuthController {

    static async login(req: IValidatedRequest<IValidatedRequestBody<IUserAuth>>, res: any) {
        try {
            const data = await AuthRepository.getUserByEmail(req.body.email);
            if (!data) return ErrorService.error(res, ErrorEnum.passPhoneIncorrect, CONFLICT);

            const passwordResult = PasswordService.decode(req.body.password, data.password);
            if (!passwordResult)
                return ErrorService.error(res, ErrorEnum.passPhoneIncorrect, CONFLICT);

            const token = await JwtService.issue({
                id: data.id!,
                phone: data.phone,
                full_name: data.firstName + ' ' + data.lastName + ' ' + (data.middleName ? data.middleName : ''),
                login: data.email,
                date: new Date()
            });

        } catch (error) {
            ErrorService.error(res, error);
        }
    }
    

    static async refresh(req: IValidatedRequest<IValidatedRequestBody<IRefreshToken>>, res: any) {
        try {
            const userData = await JwtService.verify(req.body.refreshToken);
            if (!userData || !userData.id) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED);
            const tokens = await JwtService.generateCode(userData);

            res.send(tokens);
        } catch (error: any) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }

    static async logout(req: IValidatedRequest<IValidatedRequestBody<IRefreshToken>>, res: any) {
        try {
            const userData = await JwtService.verify(req.body.refreshToken);
            if (!userData || !userData.id) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED);

            await JwtService.decode(userData.id);
            res.send();
        } catch (error: any) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }
}