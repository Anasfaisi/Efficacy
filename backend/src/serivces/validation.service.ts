import { IValidationService } from './Interfaces/IValidation.service';
import { ErrorMessages } from '@/types/response-messages.types';
export class ValidationService implements IValidationService {
    validateLoginInput({
        email,
        password,
        role,
    }: {
        email: string;
        password: string;
        role?: string;
    }) {
        if (!email || !password) {
            throw new Error(ErrorMessages.EmailPasswordRequired);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error(ErrorMessages.InvalidEmail);
        }
        if (password.length < 6) {
            throw new Error(ErrorMessages.PasswordComplexity);
        }
    }

    validateRegisterInput({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) {
        if (!email || !password || !name) {
            throw new Error(ErrorMessages.AllFieldsRequired);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error(ErrorMessages.InvalidEmail);
        }
        console.log('email...', email);
        if (password.length < 6) {
            throw new Error(ErrorMessages.PasswordComplexity);
        }
    }

    validateGoogleLoginInput({
        role,
        endpoint,
    }: {
        role?: string;
        endpoint: 'admin' | 'user' | 'mentor';
    }) {
        if (
            role &&
            ((endpoint === 'admin' && role !== 'admin') ||
                (endpoint === 'user' && role !== 'user') ||
                (endpoint === 'mentor' && role !== 'mentor'))
        ) {
            throw new Error(`${ErrorMessages.InvalidRoleGoogleLogin} for ${endpoint}`);
        }
        console.log('Successfully validated Google login at backend');
    }
}
