import { BaseRepository } from './baseRepository';
import MentorModel, {IMentor} from "@/models/Mentor"
import { IMentorRepository } from './interfaces/IMentorRepository';

export class MentorRepository extends BaseRepository implements IMentorRepository{
    constructor(){
        super(MentorModel)
    }
    
      async findByEmail(email: string): Promise<IMentor | null> {
        return this.findOne({ email });
      }
    
      async createUser(data: { email: string; password: string; name: string; role: string }): Promise<IMentor> {
        return this.create(data);
      }
      async findById(id: string): Promise<IMentor | null> {
        return this.findById(id);
      }
    

}