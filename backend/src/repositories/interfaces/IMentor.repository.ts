export interface IMentorRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  createUser(data: { email: string; password: string; name: string; role: string }): Promise<any>;
}
