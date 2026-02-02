export interface INote {
    _id: string;
    id?: string; 
    title: string;
    content: string; 
    createdAt: string;
    updatedAt: string;
    isSticky?: boolean;
}

export type CreateNoteDTO = Omit<INote, '_id' | 'id' | 'createdAt' | 'updatedAt'>;
