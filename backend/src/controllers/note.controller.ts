import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { INoteService } from '../serivces/Interfaces/INote.service';
import { TYPES } from '../config/inversify-key.types';
import HttpStatus from '../types/http-status.enum';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

@injectable()
export class NoteController {
    constructor(@inject(TYPES.NoteService) private noteService: INoteService) {}

    async createNote(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return;
        }

        const { title, content, isSticky } = req.body;
        
        const note = await this.noteService.createNote({
            userId,
            title: title || 'Untitled Note',
            content: content || '',
            isSticky: isSticky || false
        });

        res.status(HttpStatus.CREATED).json(note);
    }

    async getNotes(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return;
        }

        const notes = await this.noteService.getUserNotes(userId);
        res.status(HttpStatus.OK).json(notes);
    }

    async updateNote(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updateData = req.body;

        const updatedNote = await this.noteService.updateNote(id, updateData);
        if (!updatedNote) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Note not found' });
            return;
        }

        res.status(HttpStatus.OK).json(updatedNote);
    }

    async deleteNote(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this.noteService.deleteNote(id);
        res.status(HttpStatus.OK).json({ message: 'Note deleted successfully' });
    }
}
