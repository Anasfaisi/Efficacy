import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { INoteService } from '../services/Interfaces/INote.service';
import { TYPES } from '../config/inversify-key.types';
import HttpStatus from '../types/http-status.enum';
import {
    ErrorMessages,
    SuccessMessages,
    CommonMessages,
} from '@/types/response-messages.types';

@injectable()
export class NoteController {
    constructor(
        @inject(TYPES.NoteService) private _noteService: INoteService
    ) {}

    async createNote(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: CommonMessages.Unauthorized,
            });
            return;
        }

        const { title, content, isSticky } = req.body;

        const note = await this._noteService.createNote({
            userId,
            title: title || 'Untitled Note',
            content: content || '',
            isSticky: isSticky || false,
        });

        res.status(HttpStatus.CREATED).json(note);
    }

    async getNotes(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: CommonMessages.Unauthorized,
            });
            return;
        }

        const notes = await this._noteService.getUserNotes(userId);
        res.status(HttpStatus.OK).json(notes);
    }

    async updateNote(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updateData = req.body;

        const updatedNote = await this._noteService.updateNote(id, updateData);
        if (!updatedNote) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: ErrorMessages.NoteNotFound,
            });
            return;
        }

        res.status(HttpStatus.OK).json(updatedNote);
    }

    async deleteNote(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this._noteService.deleteNote(id);
        res.status(HttpStatus.OK).json({
            message: SuccessMessages.NoteDeleted,
        });
    }
}
