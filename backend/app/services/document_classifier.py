from typing import Optional, List, Dict, Any

DOCUMENT_KEYWORDS = {
    "passport": ["passport", "passeport", "pasaporte", "republic", "kingdom", "mrz", "P<"],
    "visa": ["visa", "entry permit", "type c", "type d", "valid for", "number of entries", "duration of stay"],
    "national_id": ["national id", "identity card", "carte d'identite", "cedula", "id card", "republic of"],
    "driving_license": ["driver license", "driving licence", "dl no", "class", "permis de conduire"],
    "permit": ["residence permit", "work permit", "permit no", "stay permit", "authorization"],
    "certificate": ["certificate", "birth certificate", "marriage certificate", "attestation"]
}

class DocumentClassifier:
    def classify(self, text_tokens: List[str], user_override: Optional[str] = None) -> str:
        """
        Classify document type using user override if provided, otherwise keyword frequency matching.
        Returns: passport | visa | national_id | driving_license | permit | certificate | unknown
        """
        if user_override and user_override in DOCUMENT_KEYWORDS:
            return user_override
        
        full_text = " ".join(text_tokens).lower()

        # Check for MRZ passport signature (P< or 2 lines starting with P)
        if "p<" in full_text or "p1" in full_text or "p2" in full_text or "passport" in full_text:
            return "passport"

        scores: Dict[str, int] = {k: 0 for k in DOCUMENT_KEYWORDS}
        for doc_type, keywords in DOCUMENT_KEYWORDS.items():
            for kw in keywords:
                if kw in full_text:
                    scores[doc_type] += 1

        best_type, best_score = max(scores.items(), key=lambda item: item[1])
        if best_score > 0:
            return best_type
        
        return "unknown"

document_classifier = DocumentClassifier()
