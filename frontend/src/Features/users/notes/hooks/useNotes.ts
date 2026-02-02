import { useState, useEffect } from 'react';
import type { INote } from '../types';
import { toast } from 'sonner';
import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi } from '@/Services/notes.api';

export const useNotes = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const data = await getNotesApi();
            setNotes(data);
        } catch (error) {
            console.error('Failed to load notes:', error);
            // toast.error('Failed to load notes');
        } finally {
            setIsLoading(false);
        }
    };

    const createNote = async () => {
        try {
            const newNote = await createNoteApi({
                title: 'Untitled Note',
                content: '',
                isSticky: false,
            });
            setNotes((prev) => [newNote, ...prev]);
            setActiveNoteId(newNote._id);
            return newNote;
        } catch (error) {
            console.error('Failed to create note:', error);
            toast.error('Failed to create note');
        }
    };

    const updateNote = async (id: string, updates: Partial<INote>) => {
        // Optimistic update
        setNotes((prev) =>
            prev.map((note) =>
                (note._id === id || note.id === id) ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
            )
        );

        try {
            await updateNoteApi(id, updates);
        } catch (error) {
            console.error('Failed to update note:', error);
            toast.error('Failed to save changes');
            // Revert changes if needed (not implemented here for simplicity)
        }
    };

    const deleteNote = async (id: string) => {
         // Optimistic delete
         const previousNotes = [...notes];
         setNotes((prev) => prev.filter((note) => (note._id !== id && note.id !== id)));
         
         if (activeNoteId === id) {
             setActiveNoteId(null);
         }

        try {
            await deleteNoteApi(id);
            toast.success('Note deleted');
        } catch (error) {
            console.error('Failed to delete note:', error);
            toast.error('Failed to delete note');
            setNotes(previousNotes); // Revert
        }
    };

    return {
        notes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        isLoading
    };
};
