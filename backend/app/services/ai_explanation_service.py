import json
from typing import Dict, Any, Optional
from ..config import settings
from ..models.risk import RiskAssessmentResult

class AIExplanationService:
    def generate_explanation(self, risk_assessment: RiskAssessmentResult, doc_type: str = "passport") -> str:
        if not settings.GEMINI_API_KEY:
            return self._deterministic_fallback(risk_assessment, doc_type)

        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            evidence_summary = [
                {"title": e.title, "severity": e.severity, "source": e.source, "description": e.description}
                for e in risk_assessment.evidence
            ]

            payload = {
                "document_type": doc_type,
                "risk_score": risk_assessment.risk_score,
                "risk_level": risk_assessment.risk_level,
                "recommendation": risk_assessment.recommendation,
                "evidence": evidence_summary
            }

            prompt = f"""
You are an expert evidence-summarization assistant for border screening officers using TRUST SCAN.
Explain the provided document-screening findings clearly, objectively, and neutrally.

CRITICAL INSTRUCTIONS:
1. Do NOT claim that the document is definitely fraudulent or that the person is fraudulent.
2. Do NOT invent findings or evidence not present in the payload.
3. Recommend human officer review when appropriate.
4. Format output with standard markdown section headings:
   ## Screening Summary
   ## Key Findings
   ## Why Review Is Recommended

Input Evidence Payload:
{json.dumps(payload, indent=2)}
"""

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )

            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"Gemini API explanation generation error: {e}. Using fallback.")

        return self._deterministic_fallback(risk_assessment, doc_type)

    def _deterministic_fallback(self, risk_assessment: RiskAssessmentResult, doc_type: str) -> str:
        level = risk_assessment.risk_level
        score = risk_assessment.risk_score
        evidence_count = len(risk_assessment.evidence)

        summary_lines = [
            "## Screening Summary",
            f"Automated risk assessment calculated a screening score of **{score}/100** (**{level} Risk**). "
            f"The evaluation evaluated document rules, optical character recognition consistency, image forensics, face matching, and metadata signals.",
            "",
            "## Key Findings"
        ]

        if evidence_count == 0:
            summary_lines.append("* No significant anomalies or rule violations detected during processing.")
        else:
            for ev in risk_assessment.evidence:
                icon = "🔴" if ev.severity == "HIGH" else ("orange" if ev.severity == "MEDIUM" else "🟡")
                summary_lines.append(f"- {icon} **{ev.title}** ({ev.source}): {ev.description}")

        summary_lines.extend([
            "",
            "## Why Review Is Recommended",
            f"Based on a risk score of {score}/100, the system recommends **{risk_assessment.recommendation.replace('_', ' ')}**. "
            "TRUST SCAN provides decision support only. Border screening officers should inspect physical security features, perform secondary inspection, and conduct manual verification as per official protocol."
        ])

        return "\n".join(summary_lines)

ai_explanation_service = AIExplanationService()
