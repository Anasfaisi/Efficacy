import { OAuth2Client } from 'google-auth-library';
import { injectable } from 'inversify';
import { IValidationService } from './Interfaces/IValidation.service';
import { Role } from '@/types/role.types';
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
            console.error(Error);
            throw new Error('Email and password are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
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
            throw new Error('Email, password, and name are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }
        console.log('email...', email);
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
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
            throw new Error(`Invalid role for ${endpoint} Google login`);
        }
        console.log('Successfully validated Google login at backend');
    }
}
