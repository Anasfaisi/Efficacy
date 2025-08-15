import { Model } from 'mongoose';
import { IBaseRepository } from './interfaces/IBase.repository';

export class BaseRepository implements IBaseRepository {
  protected model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async findOne(query: any) {
    return this.model.findOne(query);
  }

  async create(data: any) {
    const document = new this.model(data);
    return document.save();
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async updateOne(id: string, data: any) {
    await this.model.updateOne({ _id: id }, data);
  }

  async deleteOne(id: string) {
    await this.model.deleteOne({ _id: id });
  }
}

