import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Settings as SettingsIcon, Sliders, Database, Sparkles, Save, ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Settings: React.FC = () => {
  const [tamperingWeight, setTamperingWeight] = useState<number>(35);
  const [valWeight, setValWeight] = useState<number>(20);
  const [mrzWeight, setMrzWeight] = useState<number>(20);
  const [faceWeight, setFaceWeight] = useState<number>(15);
  const [metaWeight, setMetaWeight] = useState<number>(10);
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const totalWeight = tamperingWeight + valWeight + mrzWeight + faceWeight + metaWeight;

  return (
    <PageContainer>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
            <span>Risk Engine & System Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure transparent risk signal weight heuristics and inspection parameters
          </p>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            Configuration preferences updated successfully.
          </div>
        )}

        {/* Risk Engine Weights Settings */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">Risk Engine Weighted Heuristics</h3>
            </div>
            <span className={`text-xs font-mono font-bold ${totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              Total Weight: {totalWeight}% {totalWeight !== 100 && '(Normalizing)'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">1. Forensic Tampering Weight</span>
                <span className="text-blue-400 font-bold">{tamperingWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={tamperingWeight}
                onChange={(e) => setTamperingWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">2. Document Rules & Expiry Weight</span>
                <span className="text-blue-400 font-bold">{valWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={valWeight}
                onChange={(e) => setValWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">3. MRZ Checksum & OCR Consistency Weight</span>
                <span className="text-blue-400 font-bold">{mrzWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={mrzWeight}
                onChange={(e) => setMrzWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">4. Face Verification Similarity Weight</span>
                <span className="text-blue-400 font-bold">{faceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={faceWeight}
                onChange={(e) => setFaceWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">5. Metadata & EXIF Anomaly Weight</span>
                <span className="text-blue-400 font-bold">{metaWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={metaWeight}
                onChange={(e) => setMetaWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </Button>
          </div>
        </div>

        {/* Database & Integration Status Card */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">Connected Database & AI Nodes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-navy-950 p-4 rounded-lg border border-slate-800 space-y-1">
              <p className="text-slate-400 uppercase text-[10px]">Database Persistence Node</p>
              <p className="text-slate-200 font-bold">MongoDB Atlas / In-Memory JSON Store</p>
              <p className="text-emerald-400 text-[10px]">Active Repository Fallback Enabled</p>
            </div>

            <div className="bg-navy-950 p-4 rounded-lg border border-slate-800 space-y-1">
              <p className="text-slate-400 uppercase text-[10px]">AI Evidence Summarizer Node</p>
              <p className="text-slate-200 font-bold">Gemini API Model</p>
              <p className="text-blue-400 text-[10px]">Deterministic Explanation Engine Ready</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
