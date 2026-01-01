import { Model, Document } from 'mongoose';
import { IBaseRepository } from './interfaces/IBase.repository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findOne(query: Partial<T>): Promise<T | null> {
        return this.model.findOne(query as any).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const document = new this.model(data);
        return document.save();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async updateOne(id: string, data: Partial<T>): Promise<void> {
        await this.model.updateOne({ _id: id }, data).exec();
    }

    async deleteOne(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id }).exec();
    }

    async find(query: Partial<T>): Promise<T[]> {
        return this.model.find(query as any).exec();
    }
}

