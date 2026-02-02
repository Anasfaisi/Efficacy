import { z } from 'zod';

export const noteSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    isSticky: z.boolean().optional(),
});

export const updateNoteSchema = noteSchema.partial();
