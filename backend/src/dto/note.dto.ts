export interface CreateNoteDTO {
    userId: string;
    title?: string;
    content?: string;
    isSticky?: boolean;
}

export interface UpdateNoteDTO {
    title?: string;
    content?: string;
    isSticky?: boolean;
}
