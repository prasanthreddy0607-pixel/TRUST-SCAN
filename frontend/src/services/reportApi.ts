import { API_BASE_URL } from './api';

export const reportApi = {
  getReportPdfUrl: (screeningId: string): string => {
    return `${API_BASE_URL}/api/report/${screeningId}`;
  },
  getFileUrl: (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const baseName = path.split(/[/\\]/).pop();
    return `${API_BASE_URL}/api/files/${baseName}`;
  }
};
