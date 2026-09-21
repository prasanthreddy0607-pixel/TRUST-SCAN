export const getRiskBadgeClass = (riskLevel?: string): string => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return 'badge-high';
    case 'MEDIUM':
      return 'badge-medium';
    case 'LOW':
    default:
      return 'badge-low';
  }
};

export const getRiskColor = (riskLevel?: string): string => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return '#f43f5e'; // Soft Rose Coral
    case 'MEDIUM':
      return '#f59e0b'; // Soft Amber
    case 'LOW':
    default:
      return '#10b981'; // Soft Emerald
  }
};
