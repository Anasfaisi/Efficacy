import api from './axiosConfig';
import type { mentorFormSchemaType } from '@/types/zodSchemas';

export interface MentorApplicationResult {
  status: string;
  result?: unknown;
}

export const mentorApi = {
  submitApplication: async (
    data: mentorFormSchemaType,
    files: {
      certificate: File | null;
      resume: File | null;
      idProof: File | null;
    },
  ): Promise<MentorApplicationResult> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    if (files.resume) formData.append('resume', files.resume);
    if (files.certificate) formData.append('certificate', files.certificate);
    if (files.idProof) formData.append('idProof', files.idProof);
    for (const [key, value] of formData) {
      console.log(key, value, 'form data');
    }

    const res = await api.post('/mentor/application/init', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      status: res.data.result?.status || 'pending',
      result: res.data.result,
    };
  },
  activateMentor: async (monthlyCharge: number) => {
    const res = await api.post('/mentor/activate', { monthlyCharge });
    return res.data;
  },
};
