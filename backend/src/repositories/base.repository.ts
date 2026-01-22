import { Model, Document, FilterQuery } from 'mongoose';
import { IBaseRepository } from './interfaces/IBase.repository';
import { injectable } from 'inversify';

@injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(query).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const document = new this.model(data);
        console.log(document, 'document');
        return document.save();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async updateOne(id: string, data: Partial<T>): Promise<void> {
        await this.model.updateOne({ _id: id }, data).exec();
    }

    async updateMany(query: FilterQuery<T>, data: Partial<T>): Promise<void> {
        await this.model.updateMany(query, data).exec();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async deleteOne(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id }).exec();
    }

    async find(query: FilterQuery<T>): Promise<T[]> {
        return this.model.find(query).exec();
    }
}
