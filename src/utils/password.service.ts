import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs';

export class PasswordService {

    static checkPassword(hash: string, password: string): boolean {
        return hash == this.generateMD5(password);
    }


    static generateBcrypt(input): string {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(input, salt);
    }

    static decode(input, output) {
        return bcrypt.compareSync(input, output);
    }


    static generateMD5(input): string {
        return crypto.createHash('md5').update(input).digest('hex');
    }

    static maskPhone(input): string {
        return input.substr(0, 6) + '*****' + input.substr(-2, 2);
    }
}
