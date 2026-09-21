import api from './api';
import { DocumentComparisonResult } from '../types/screening';

export const comparisonApi = {
  compareDocuments: async (originalFile: File, presentedFile: File): Promise<DocumentComparisonResult> => {
    const formData = new FormData();
    formData.append('original_file', originalFile);
    formData.append('presented_file', presentedFile);

    const response = await api.post<DocumentComparisonResult>('/compare', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getComparison: async (id: string): Promise<DocumentComparisonResult> => {
    const response = await api.get<DocumentComparisonResult>(`/compare/${id}`);
    return response.data;
  }
};
