import { injectable } from 'inversify';
import { NoteModel, INote } from '../models/Note.model';
import { BaseRepository } from './base.repository';
import { INoteRepository } from './interfaces/INote.repository';

@injectable()
export class NoteRepository extends BaseRepository<INote> implements INoteRepository {
    constructor() {
        super(NoteModel);
    }


    async findByUserId(userId: string): Promise<INote[]> {
        return this.model.find({ userId }).sort({ updatedAt: -1 }).exec();
    }
}
