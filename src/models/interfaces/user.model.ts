import { IChat } from "./chat.model";

export interface IUser {
    id: number,
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    password: string;
    phone: string;
    chats?: IChat[]
}

export interface IExists {
    exists: boolean
}

export interface IUserDetails {
    id: number,
    firstName: string,
    lastName: string,
    email: string
}

export interface IUserId {
    id: number
}