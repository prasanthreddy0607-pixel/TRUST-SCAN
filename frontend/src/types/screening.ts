import { OCRResult, MRZResult } from './document';
import { ForensicAnalysisResult } from './forensic';
import { RiskAssessmentResult } from './risk';

export interface RuleCheckResult {
  rule_name: string;
  passed: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  field?: string;
}

export interface DocumentValidationResult {
  document_type: string;
  valid: boolean;
  checks: RuleCheckResult[];
  total_checks: number;
  passed_checks: number;
  failed_checks: number;
}

export interface FaceVerificationResult {
  similarity: number;
  status: 'MATCH' | 'REVIEW_REQUIRED' | 'NO_FACE_DETECTED' | 'UNABLE_TO_VERIFY';
  confidence: number;
  detected_in_document: boolean;
  detected_in_reference: boolean;
  details: string;
}

export interface WatchlistMatchResult {
  matched: boolean;
  document_number?: string;
  status: string;
  reason?: string;
  disclaimer: string;
}

export interface ScreeningRecord {
  screening_id: string;
  filename: string;
  file_path: string;
  document_type: string;
  created_at: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  
  ocr_result?: OCRResult;
  mrz_result?: MRZResult;
  validation_result?: DocumentValidationResult;
  forensic_result?: ForensicAnalysisResult;
  face_result?: FaceVerificationResult;
  watchlist_result?: WatchlistMatchResult;
  
  risk_assessment?: RiskAssessmentResult;
  ai_summary?: string;
  
  original_image_url: string;
  annotated_image_url?: string;
  report_pdf_url?: string;
  processing_time_ms: number;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  expected_risk: string;
  badge: string;
}

export interface DocumentComparisonResult {
  comparison_id: string;
  difference_score: number;
  changed_regions_count: number;
  changed_regions: Array<{
    id: string;
    region: { x: number; y: number; width: number; height: number };
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    label: string;
    area_pixels: number;
  }>;
  annotated_diff_image_url: string;
  original_image_url: string;
  presented_image_url: string;
}
