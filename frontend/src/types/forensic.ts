export interface RegionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface TamperingFinding {
  detector: string;
  score: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'CLEAN' | 'SUSPICIOUS' | 'REVIEW_REQUIRED' | 'UNABLE_TO_VERIFY' | 'VERIFIED_PRESENT';
  region?: RegionBox;
  explanation: string;
  details: Record<string, any>;
}

export interface ForensicAnalysisResult {
  findings: TamperingFinding[];
  overall_tampering_score: number;
  suspicious_regions_count: number;
  annotated_image_url?: string;
}
