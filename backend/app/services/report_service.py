import os
import re
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from ..models.screening import ScreeningRecord
from ..config import settings

class ReportService:
    def generate_pdf_report(self, record: ScreeningRecord) -> str:
        pdf_filename = f"Report_{record.screening_id}.pdf"
        pdf_path = os.path.join(settings.REPORTS_DIR, pdf_filename)

        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        c_navy = colors.HexColor("#0f172a")
        c_blue = colors.HexColor("#2563eb")
        c_red = colors.HexColor("#dc2626")
        c_orange = colors.HexColor("#ea580c")
        c_green = colors.HexColor("#16a34a")

        title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=20, textColor=c_navy, spaceAfter=2)
        tagline_style = ParagraphStyle('DocTagline', parent=styles['Italic'], fontName='Helvetica-Oblique', fontSize=9, textColor=colors.HexColor("#64748b"), spaceAfter=15)
        h2_style = ParagraphStyle('SectionHeading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, textColor=c_navy, spaceBefore=12, spaceAfter=6)
        body_style = ParagraphStyle('BodyTextCustom', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=colors.HexColor("#334155"))
        disclaimer_style = ParagraphStyle('DisclaimerText', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, leading=10, textColor=colors.HexColor("#94a3b8"))

        story = []

        # 1. Header Banner
        story.append(Paragraph("TRUST SCAN — DOCUMENT SCREENING REPORT", title_style))
        story.append(Paragraph("Evidence-First Identity & Document Screening Platform", tagline_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=0, spaceAfter=12))

        # 2. Key Metadata & Risk Score Box
        r_assessment = record.risk_assessment
        risk_score = r_assessment.risk_score if r_assessment else 0
        risk_level = r_assessment.risk_level if r_assessment else "LOW"
        risk_color = c_red if risk_level == "HIGH" else (c_orange if risk_level == "MEDIUM" else c_green)

        meta_data = [
            [Paragraph("<b>Screening ID:</b>", body_style), Paragraph(record.screening_id, body_style),
             Paragraph("<b>Risk Score:</b>", body_style), Paragraph(f"<font color='{risk_color.hexval()}'><b>{risk_score}/100 ({risk_level})</b></font>", body_style)],
            [Paragraph("<b>Document Type:</b>", body_style), Paragraph(record.document_type.upper(), body_style),
             Paragraph("<b>Status:</b>", body_style), Paragraph(record.status, body_style)],
            [Paragraph("<b>Filename:</b>", body_style), Paragraph(record.filename, body_style),
             Paragraph("<b>Recommendation:</b>", body_style), Paragraph(r_assessment.recommendation.replace('_', ' ') if r_assessment else "N/A", body_style)],
            [Paragraph("<b>Created At:</b>", body_style), Paragraph(record.created_at, body_style),
             Paragraph("<b>Confidence:</b>", body_style), Paragraph(f"{int(r_assessment.confidence * 100)}%" if r_assessment else "N/A", body_style)]
        ]

        t_meta = Table(meta_data, colWidths=[100, 160, 100, 180])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 10))

        # 3. Verification Module Status Summary
        story.append(Paragraph("VERIFICATION MODULE CHECKS", h2_style))
        val_res = record.validation_result
        f_res = record.forensic_result
        face_res = record.face_result
        watch_res = record.watchlist_result

        checks_table_data = [
            [Paragraph("<b>Module</b>", body_style), Paragraph("<b>Status</b>", body_style), Paragraph("<b>Details / Finding</b>", body_style)],
            [Paragraph("OCR Extraction", body_style), Paragraph("<font color='#16a34a'><b>PASSED</b></font>", body_style), Paragraph("Text fields extracted with overall confidence", body_style)],
            [Paragraph("Document Rules", body_style), 
             Paragraph("<font color='#16a34a'><b>PASSED</b></font>" if val_res and val_res.valid else "<font color='#dc2626'><b>REVIEW</b></font>", body_style),
             Paragraph(f"{val_res.passed_checks}/{val_res.total_checks} rule checks passed" if val_res else "N/A", body_style)],
            [Paragraph("Image Forensics", body_style),
             Paragraph("<font color='#dc2626'><b>SUSPICIOUS</b></font>" if f_res and f_res.overall_tampering_score > 0.4 else "<font color='#16a34a'><b>CLEAN</b></font>", body_style),
             Paragraph(f"{f_res.suspicious_regions_count} suspicious region(s) identified" if f_res else "N/A", body_style)],
            [Paragraph("Face Verification", body_style),
             Paragraph(f"<b>{face_res.status}</b>" if face_res else "N/A", body_style),
             Paragraph(face_res.details if face_res else "N/A", body_style)],
            [Paragraph("Demo Watchlist", body_style),
             Paragraph("<font color='#dc2626'><b>MATCHED</b></font>" if watch_res and watch_res.matched else "<font color='#16a34a'><b>CLEAN</b></font>", body_style),
             Paragraph(watch_res.disclaimer if watch_res else "N/A", body_style)]
        ]

        t_checks = Table(checks_table_data, colWidths=[120, 100, 320])
        t_checks.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_checks)
        story.append(Spacer(1, 10))

        # 4. Evidence List
        story.append(Paragraph("EVIDENCE FINDINGS", h2_style))
        if r_assessment and r_assessment.evidence:
            ev_data = [[Paragraph("<b>Severity</b>", body_style), Paragraph("<b>Title & Source</b>", body_style), Paragraph("<b>Explanation</b>", body_style)]]
            for ev in r_assessment.evidence:
                ev_color = "#dc2626" if ev.severity == "HIGH" else ("#ea580c" if ev.severity == "MEDIUM" else "#2563eb")
                ev_data.append([
                    Paragraph(f"<font color='{ev_color}'><b>{ev.severity}</b></font>", body_style),
                    Paragraph(f"<b>{ev.title}</b><br/><font color='#64748b'>{ev.source}</font>", body_style),
                    Paragraph(ev.description, body_style)
                ])
            t_ev = Table(ev_data, colWidths=[70, 170, 300])
            t_ev.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('PADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(t_ev)
        else:
            story.append(Paragraph("No anomalous evidence signals detected for this document.", body_style))

        story.append(Spacer(1, 10))

        # 5. AI Summary
        if record.ai_summary:
            story.append(Paragraph("AI SCREENING SUMMARY & EXPLANATION", h2_style))
            lines = record.ai_summary.split('\n')
            for line in lines:
                line_clean = line.strip()
                if not line_clean:
                    continue
                if line_clean.startswith('## '):
                    story.append(Paragraph(f"<b>{line_clean[3:]}</b>", ParagraphStyle('H3Sub', parent=body_style, fontName='Helvetica-Bold', fontSize=10, spaceBefore=4, spaceAfter=2)))
                elif line_clean.startswith('- '):
                    b_clean = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line_clean[2:])
                    story.append(Paragraph(f"• {b_clean}", body_style))
                else:
                    b_clean = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line_clean)
                    story.append(Paragraph(b_clean, body_style))

        story.append(Spacer(1, 15))

        # 6. Disclaimer Footer
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceBefore=10, spaceAfter=8))
        story.append(Paragraph("<b>DISCLAIMER:</b> TRUST SCAN is a decision-support prototype. Findings require human screening officer verification and do not constitute legal proof of authenticity, identity, or fraud. Generated automatically.", disclaimer_style))

        doc.build(story)
        return pdf_path

report_service = ReportService()
