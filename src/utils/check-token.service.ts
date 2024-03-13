import { ErrorService } from './error.service';
import { JwtService } from './jwt.service';
import { ErrorEnum } from './../models/enums/error.enum';
import { IUser } from './../models/interfaces/user.model';
import { UNAUTHORIZED } from 'http-status-codes';
import { IValidatedRequest } from '../models';
import { redisClient } from './redis.service';


export const checkToken = async (req: IValidatedRequest<any>, res, next) => {
    try {
        let authorization = null;
        if (req.headers && req.headers.authorization) {
            authorization = req.headers.authorization.split(' ')[1];
        }

        if (!authorization) return ErrorService.error(res, ErrorEnum.token, UNAUTHORIZED);

        const decode = await JwtService.verify(authorization);
        if (!decode) return ErrorService.error(res, ErrorEnum.Unauthorized, UNAUTHORIZED);


    } catch (error) {
        ErrorService.error(res, ErrorEnum.Unauthorized, UNAUTHORIZED)
    }
}

export const checkHeader = (req: IValidatedRequest<any>, res, next) => {
    try {

        if (!req.headers.language)
            req.headers.language = 'ru';
        req.query.language = req.headers.language;
        req.body.language = req.headers.language;

        next();
        
    } catch (error) {
        ErrorService.error(res, error, UNAUTHORIZED)
    }
};