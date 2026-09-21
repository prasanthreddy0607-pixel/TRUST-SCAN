export interface OCRField {
  value: string;
  confidence: number;
  bounding_box?: [number, number, number, number];
}

export interface OCRResult {
  document_type: string;
  fields: Record<string, OCRField>;
  raw_ocr: Array<{
    text: string;
    confidence: number;
    bounding_box: [number, number, number, number];
  }>;
  overall_confidence: number;
}

export interface MRZFieldComparison {
  ocr?: string;
  mrz?: string;
  consistent: boolean;
}

export interface MRZResult {
  detected: boolean;
  raw_mrz: string[];
  document_code?: string;
  issuing_country?: string;
  surname?: string;
  given_names?: string;
  passport_number?: string;
  nationality?: string;
  date_of_birth?: string;
  sex?: string;
  expiry_date?: string;
  check_digits_valid: boolean;
  field_comparisons: Record<string, MRZFieldComparison>;
}
