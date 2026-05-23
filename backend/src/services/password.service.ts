import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IPasswordService } from './Interfaces/IPassword.service';

@injectable()
export class PasswordService implements IPasswordService {
    private readonly saltRounds = 10;

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }

    async comparePassword(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }
}
