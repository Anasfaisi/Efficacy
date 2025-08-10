// import mongoose,{Model, Document} from "mongoose";

// interface BaseRepository <T extends Document>{
//     create (data: Partial <T>): Promise <T>;
//     findById(id: string):Promise<T | null>;
//     findOne(query:object):Promise<T | null>;
//     update(id:string,data:Partial<T>):Promise<T |null>;
//     delete(id:string):Promise<boolean >;
// }

// class BaseRepositoryImpl<T extends Document> implements BaseRepository<T>{
//     private model : Model<T>;
//     constructor(model : Model<T>){
//         this.model = model;
//     }  
    
//     async create(data : Partial<T> ):Promise<T>{
//         const doc = new this.model(data)
//         return await doc.save()
//     }

//     async findById(id:string):Promise<T | null>{

//         return await this.model.findById(id).exec()
//     }

//     async findOne(query:object):Promise<T |null>{
//         console.log("[BaseRepository] findOne called with query:", query);
//         const l = await this.model.findOne(query)
//         console.log(l,"l");
        
//         return l
//     }

//     async update(id:string,data :Partial<T>):Promise<T | null>{
//         return await this.model.findByIdAndUpdate(id,data,{new:true, runValidators:true}).exec()
//     }

//     async delete(id:string):Promise<boolean> {
//         const result = await this.model.findByIdAndDelete(id).exec();
//         return !! result
//     }
// }

// export default BaseRepositoryImpl



import { Model } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

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

