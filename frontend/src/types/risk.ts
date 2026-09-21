export interface EvidenceItem {
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  source: string;
  description: string;
}

export interface RiskAssessmentResult {
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  recommendation: 'ACCEPTABLE' | 'REVIEW_REQUIRED' | 'MANUAL_VERIFICATION_RECOMMENDED';
  weights_used: Record<string, number>;
  signal_scores: Record<string, number>;
  evidence: EvidenceItem[];
}
