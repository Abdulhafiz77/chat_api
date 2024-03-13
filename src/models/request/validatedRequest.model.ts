import express = require('express');
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";
import { ParsedQs } from "qs";
import { IUser } from '../interfaces';

export interface  IValidatedRequest<T extends ValidatedRequestSchema> extends express.Request {
    body: T[ContainerTypes.Body];
    query: T[ContainerTypes.Query] & ParsedQs;
    headers: T[ContainerTypes.Headers];
    params: T[ContainerTypes.Params];
    userId: IUser;
    file: any;
}