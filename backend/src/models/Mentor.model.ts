import { Schema, model, Document, ObjectId } from 'mongoose';

interface IMentor extends Document<ObjectId> {
    name: string;
    email: string;
    password: string;
    role: string;
    expertise?: string;
    bio?: string;
}

const mentorSchema = new Schema<IMentor>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'mentor' },
    expertise: { type: String },
    bio: { type: String },
});

export { IMentor };
export default model<IMentor>('Mentors', mentorSchema);
