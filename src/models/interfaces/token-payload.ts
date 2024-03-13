
export interface TokenPayload {
    id: number;
    login: string;
    phone: string;
    full_name: string;
    date: Date;
}

export interface AuthenticateModel {
    login: string;
    password: string;
}
