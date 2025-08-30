export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  createUser(data: { email: string; password: string; name: string; role: string;googleId?:string }): Promise<any>;
    updatePasswordById(id: string, newPassword: string): Promise<any>;

}
