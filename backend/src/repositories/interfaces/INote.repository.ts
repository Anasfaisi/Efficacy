import { IBaseRepository } from './IBase.repository';
import { INote } from '@/models/Note.model';

export interface INoteRepository extends IBaseRepository<INote> {
    findByUserId(userId: string): Promise<INote[]>;
}
