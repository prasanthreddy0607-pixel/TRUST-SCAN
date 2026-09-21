import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileCheck2, 
  ScanSearch, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  FileText, 
  Layers 
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c1218] text-slate-200 flex flex-col font-sans selection:bg-[#34A99D] selection:text-[#0c1218]">
      {/* Header Bar */}
      <header className="px-8 py-5 border-b border-[#458393]/30 flex items-center justify-between bg-[#121b24]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#34A99D]/15 border border-[#34A99D]/30 flex items-center justify-center text-[#34A99D]">
            <ShieldAlert className="w-5 h-5 text-[#34A99D]" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-[#FFF3C8]">
              TRUST<span className="text-[#34A99D] font-extrabold">SCAN</span>
            </h1>
            <p className="text-[10px] text-[#E5CB90] font-mono">Evidence-First Screening</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/demo-mode')}>
            Try Demo
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Launch Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#34A99D]/15 border border-[#34A99D]/30 text-[#34A99D] text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#34A99D]" />
          <span>Evidence-First Identity & Document Screening Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          AI-Powered Border & Identity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3C8] via-[#E5CB90] to-[#34A99D]">
            Document Screening
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          Analyze documents, identify inconsistencies, inspect potential tampering, and assist screening officers with clear evidence-based risk assessment.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/screen/new')} className="gap-2 text-base px-8 py-3.5">
            <ShieldAlert className="w-5 h-5" />
            <span>Start Document Screening</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button size="lg" variant="secondary" onClick={() => navigate('/demo-mode')} className="gap-2 text-base px-8 py-3.5">
            <Sparkles className="w-5 h-5 text-[#E5CB90]" />
            <span>Try Preset Demo Mode</span>
          </Button>
        </div>
      </section>

      {/* How It Works Workflow (4 Steps) */}
      <section className="px-6 py-16 bg-[#121b24]/50 border-y border-[#458393]/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#FFF3C8] font-mono">
              SCREENING WORKFLOW ARCHITECTURE
            </h2>
            <p className="text-[#E5CB90] text-xs font-mono">Structured decision-support pipeline for human border officers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: '1. Scan & Upload', desc: 'Upload passport, visa, ID, or permit document image/PDF.' },
              { num: '02', title: '2. Validate Rules', desc: 'Extract OCR & MRZ fields; validate expiry dates and check digits.' },
              { num: '03', title: '3. Investigate Forensics', desc: 'Inspect ELA, photo boundaries, text stroke, and face matching.' },
              { num: '04', title: '4. Evidence Review', desc: 'Review weighted risk score, interactive overlays, & PDF report.' },
            ].map((step) => (
              <div key={step.num} className="glass-panel p-6 space-y-3 relative group hover:border-[#34A99D]/50 transition-all">
                <span className="text-2xl font-bold font-mono text-[#34A99D]/40 group-hover:text-[#34A99D] transition-colors">
                  {step.num}
                </span>
                <h3 className="font-bold text-[#FFF3C8] text-sm font-sans">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Core Capabilities */}
      <section className="px-6 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#FFF3C8]">
            Comprehensive Forensic & Verification Modules
          </h2>
          <p className="text-[#E5CB90] text-xs font-mono">Multi-layered decision support engines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FileCheck2, title: 'Multi-Engine OCR & MRZ', desc: 'Extracts fields and parses ICAO Doc 9303 checksum digits with cross-field consistency validation.' },
            { icon: ScanSearch, title: 'Forensic Tampering Suite', desc: '8 detectors inspect photo edge continuity, ELA compression variance, text stroke, and metadata.' },
            { icon: UserCheck, title: 'Face Verification', desc: 'Cross-checks document photo against live reference photo using facial feature embedding similarity.' },
            { icon: Layers, title: 'Side-by-Side Comparison', desc: 'Aligns original baseline vs presented document to extract pixel difference heatmaps and changed regions.' },
            { icon: Lock, title: 'Transparent Risk Engine', desc: 'Configurable weighted risk scoring (Tampering 35%, Validation 20%, MRZ 20%, Face 15%, Metadata 10%).' },
            { icon: FileText, title: 'Audit PDF Reports', desc: 'Generates complete PDF screening reports with annotated evidence for officer record keeping.' }
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="glass-panel p-6 space-y-3 glass-panel-hover">
                <div className="w-10 h-10 rounded-xl bg-[#34A99D]/15 border border-[#34A99D]/30 flex items-center justify-center text-[#34A99D]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#FFF3C8] text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-auto px-6 py-8 border-t border-[#458393]/30 bg-[#0c1218] text-center space-y-2">
        <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
          <strong>DISCLAIMER:</strong> TRUST SCAN is a decision-support prototype system. Results require human screening officer verification and do not constitute legal proof of document authenticity, fraud, or identity.
        </p>
        <p className="text-[11px] text-[#E5CB90] font-mono">TRUST SCAN Platform © 2026 • Evidence-First Identity & Document Screening</p>
      </footer>
    </div>
  );
};
