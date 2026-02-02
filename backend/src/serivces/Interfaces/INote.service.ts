import { INote } from '@/models/Note.model';
import { CreateNoteDTO, UpdateNoteDTO } from '@/Dto/note.dto';

export interface INoteService {
    createNote(data: CreateNoteDTO): Promise<INote>;
    getUserNotes(userId: string): Promise<INote[]>;
    updateNote(id: string, updateData: UpdateNoteDTO): Promise<INote | null>;
    deleteNote(id: string): Promise<void>;
    getNoteById(id: string): Promise<INote | null>;
}
