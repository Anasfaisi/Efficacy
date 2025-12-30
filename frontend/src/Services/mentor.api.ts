import api from './axiosConfig';
import type { mentorFormSchemaType } from '@/types/zodSchemas';

export interface MentorApplicationResult {
    status: string;
    result?: any;
}

export const mentorApi = {
    submitApplication: async (
        data: mentorFormSchemaType,
        files: { certificate: File | null; resume: File | null; idProof: File | null }
    ): Promise<MentorApplicationResult> => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => formData.append(key, v));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        if (files.resume) formData.append('resume', files.resume);
        if (files.certificate) formData.append('certificate', files.certificate);
        if (files.idProof) formData.append('idProof', files.idProof);

        const res = await api.post('/mentor/application/init', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return { status: res.data.result?.status || 'pending', result: res.data.result };
    },
};
