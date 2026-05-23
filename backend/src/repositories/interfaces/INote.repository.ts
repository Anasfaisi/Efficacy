import { IBaseRepository } from './IBase.repository';
import { INote } from '@/models/note.model';

export interface INoteRepository extends IBaseRepository<INote> {
    findByUserId(userId: string): Promise<INote[]>;
}
