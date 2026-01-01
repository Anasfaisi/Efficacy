export interface IBaseRepository<T> {
    findOne(query: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    updateOne(id: string, data: Partial<T>): Promise<void>;
    deleteOne(id: string): Promise<void>;
    find(query: Partial<T>): Promise<T[]>;
}

