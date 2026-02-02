import { Router } from 'express';
import { NoteController } from '../controllers/note.controller';
import authenticateAndAuthorize from '../middleware/authenticateAndAuthorize';
import { container } from '../config/inversify.config';
import { TYPES } from '../config/inversify-key.types';
import { TokenService } from '../serivces/token.service';
import { Role } from '../types/role.types';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function noteRoutes(noteController: NoteController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);
    const authMiddleware = authenticateAndAuthorize(tokenService, Role.User);

    router.post('/', authMiddleware, asyncWrapper(noteController.createNote.bind(noteController)));
    router.get('/', authMiddleware, asyncWrapper(noteController.getNotes.bind(noteController)));
    router.put('/:id', authMiddleware, asyncWrapper(noteController.updateNote.bind(noteController)));
    router.delete('/:id', authMiddleware, asyncWrapper(noteController.deleteNote.bind(noteController)));

    return router;
}
