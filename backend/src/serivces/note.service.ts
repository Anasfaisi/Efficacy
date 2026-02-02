import { injectable, inject } from 'inversify';
import { CreateNoteDTO, UpdateNoteDTO } from '../Dto/note.dto';
import { INote } from '../models/Note.model';
import { INoteService } from './Interfaces/INote.service';
import { INoteRepository } from '@/repositories/interfaces/INote.repository';
import { TYPES } from '@/config/inversify-key.types';

@injectable()
export class NoteService implements INoteService {
    constructor(@inject(TYPES.NoteRepository) private noteRepository: INoteRepository) {}

    async createNote(data: CreateNoteDTO): Promise<INote> {
        return this.noteRepository.create(data as unknown as Partial<INote>);
    }

    async getUserNotes(userId: string): Promise<INote[]> {
        return this.noteRepository.findByUserId(userId);
    }

    async updateNote(id: string, updateData: UpdateNoteDTO): Promise<INote | null> {
        return this.noteRepository.update(id, updateData as unknown as Partial<INote>);
    }

    async deleteNote(id: string): Promise<void> {
        return this.noteRepository.deleteOne(id);
    }

    async getNoteById(id: string): Promise<INote | null> {
        return this.noteRepository.findById(id);
    }
}
