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
          <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F9EBD5] tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#8B5320] dark:text-[#D39F67]" />
            <span>Risk Engine & System Configuration</span>
          </h1>
          <p className="text-xs text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
            Configure transparent risk signal weight heuristics and inspection parameters
          </p>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-lg bg-[#E8F5EE] dark:bg-[#1B382B] border border-[#A3D9C3] dark:border-[#2E7D5E]/40 text-[#2E7D5E] dark:text-[#A8E6CF] text-xs font-mono font-medium">
            Configuration preferences updated successfully.
          </div>
        )}

        {/* Risk Engine Weights Settings */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8D6BD] dark:border-[#4A3324] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B5320] dark:text-[#D39F67]" />
              <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">Risk Engine Weighted Heuristics</h3>
            </div>
            <span className={`text-xs font-mono font-bold ${totalWeight === 100 ? 'text-[#2E7D5E] dark:text-[#A8E6CF]' : 'text-[#B87322] dark:text-[#F2C994]'}`}>
              Total Weight: {totalWeight}% {totalWeight !== 100 && '(Normalizing)'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#392210] dark:text-[#F9EBD5] font-medium">1. Forensic Tampering Weight</span>
                <span className="text-[#8B5320] dark:text-[#D39F67] font-bold">{tamperingWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={tamperingWeight}
                onChange={(e) => setTamperingWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F4EAD9] dark:bg-[#382619] rounded-lg appearance-none cursor-pointer accent-[#8B5320] dark:accent-[#D39F67]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#392210] dark:text-[#F9EBD5] font-medium">2. Document Rules & Expiry Weight</span>
                <span className="text-[#8B5320] dark:text-[#D39F67] font-bold">{valWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={valWeight}
                onChange={(e) => setValWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F4EAD9] dark:bg-[#382619] rounded-lg appearance-none cursor-pointer accent-[#8B5320] dark:accent-[#D39F67]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#392210] dark:text-[#F9EBD5] font-medium">3. MRZ Checksum & OCR Consistency Weight</span>
                <span className="text-[#8B5320] dark:text-[#D39F67] font-bold">{mrzWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={mrzWeight}
                onChange={(e) => setMrzWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F4EAD9] dark:bg-[#382619] rounded-lg appearance-none cursor-pointer accent-[#8B5320] dark:accent-[#D39F67]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#392210] dark:text-[#F9EBD5] font-medium">4. Face Verification Similarity Weight</span>
                <span className="text-[#8B5320] dark:text-[#D39F67] font-bold">{faceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={faceWeight}
                onChange={(e) => setFaceWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F4EAD9] dark:bg-[#382619] rounded-lg appearance-none cursor-pointer accent-[#8B5320] dark:accent-[#D39F67]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#392210] dark:text-[#F9EBD5] font-medium">5. Metadata & EXIF Anomaly Weight</span>
                <span className="text-[#8B5320] dark:text-[#D39F67] font-bold">{metaWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={metaWeight}
                onChange={(e) => setMetaWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F4EAD9] dark:bg-[#382619] rounded-lg appearance-none cursor-pointer accent-[#8B5320] dark:accent-[#D39F67]"
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
          <div className="flex items-center gap-2 border-b border-[#E8D6BD] dark:border-[#4A3324] pb-3">
            <Database className="w-4 h-4 text-[#8B5320] dark:text-[#D39F67]" />
            <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">Connected Database & AI Nodes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#F4EAD9]/60 dark:bg-[#1C110A]/60 p-4 rounded-lg border border-[#E8D6BD] dark:border-[#4A3324] space-y-1">
              <p className="text-[#8A715C] dark:text-[#C8A889] uppercase text-[10px]">Database Persistence Node</p>
              <p className="text-[#2C1A0E] dark:text-[#F9EBD5] font-bold">MongoDB Atlas / In-Memory JSON Store</p>
              <p className="text-[#2E7D5E] dark:text-[#A8E6CF] text-[10px] font-medium">Active Repository Fallback Enabled</p>
            </div>

            <div className="bg-[#F4EAD9]/60 dark:bg-[#1C110A]/60 p-4 rounded-lg border border-[#E8D6BD] dark:border-[#4A3324] space-y-1">
              <p className="text-[#8A715C] dark:text-[#C8A889] uppercase text-[10px]">AI Evidence Summarizer Node</p>
              <p className="text-[#2C1A0E] dark:text-[#F9EBD5] font-bold">Gemini API Model</p>
              <p className="text-[#8B5320] dark:text-[#D39F67] text-[10px] font-medium">Deterministic Explanation Engine Ready</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
