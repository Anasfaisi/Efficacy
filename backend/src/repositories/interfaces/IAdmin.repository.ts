export interface IAdminRepository<T> {
    findByEmail(email: string): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<T>;
}
