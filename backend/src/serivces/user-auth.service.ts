import { inject, injectable } from 'inversify';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { TYPES } from '@/config/inversify-key.types';
import { IPasswordService } from './Interfaces/IPassword.service';
import { IUser } from '@/models/User.model';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class UserLoginService {
    constructor(
        @inject(TYPES.UserRepository)
        private _userRepository: IUserRepository,
        @inject(TYPES.PasswordService)
        private _passwordService: IPasswordService
    ) {}

    async login(email: string, password: string): Promise<IUser> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error(ErrorMessages.UserNotFound);
        }
        if (!user.password) {
            throw new Error(ErrorMessages.UserNotFound);
        }
        const isPasswordValid = await this._passwordService.comparePassword(
            password,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error(ErrorMessages.InvalidPassword);
        }
        return user;
    }
}
