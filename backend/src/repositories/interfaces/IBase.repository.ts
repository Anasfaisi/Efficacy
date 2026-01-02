import { FilterQuery } from 'mongoose';

export interface IBaseRepository<T> {
    findOne(query: FilterQuery<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    updateOne(id: string, data: Partial<T>): Promise<void>;
    updateMany(query: FilterQuery<T>, data: Partial<T>): Promise<void>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    deleteOne(id: string): Promise<void>;

    find(query: FilterQuery<T>): Promise<T[]>;
}
