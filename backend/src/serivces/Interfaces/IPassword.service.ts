export interface IPasswordService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashed: string): Promise<boolean>;
    comparePassword(password: string, hashed: string): Promise<boolean>;
}
