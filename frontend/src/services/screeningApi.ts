import api from './api';
import { ScreeningRecord, DemoScenario } from '../types/screening';

export const screeningApi = {
  screenDocument: async (
    file: File,
    referencePhoto?: File | null,
    documentTypeHint?: string
  ): Promise<ScreeningRecord> => {
    const formData = new FormData();
    formData.append('document_file', file);
    if (referencePhoto) {
      formData.append('reference_photo', referencePhoto);
    }
    if (documentTypeHint) {
      formData.append('document_type_hint', documentTypeHint);
    }

    const response = await api.post<ScreeningRecord>('/screen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getScreening: async (id: string): Promise<ScreeningRecord> => {
    const response = await api.get<ScreeningRecord>(`/screen/${id}`);
    return response.data;
  },

  listHistory: async (limit: number = 50): Promise<ScreeningRecord[]> => {
    const response = await api.get<ScreeningRecord[]>(`/history?limit=${limit}`);
    return response.data;
  },

  deleteScreening: async (id: string): Promise<void> => {
    await api.delete(`/screen/${id}`);
  },

  getDemoScenarios: async (): Promise<DemoScenario[]> => {
    const response = await api.get<DemoScenario[]>('/demo');
    return response.data;
  },

  runDemoScenario: async (scenarioId: string): Promise<ScreeningRecord> => {
    const response = await api.post<ScreeningRecord>(`/demo/run/${scenarioId}`);
    return response.data;
  }
};
