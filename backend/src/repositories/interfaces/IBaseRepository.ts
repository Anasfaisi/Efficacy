export interface IBaseRepository {
  findOne(query: any): Promise<any>;
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  updateOne(id: string, data: any): Promise<void>;
  deleteOne(id: string): Promise<void>;
}