import React, { useState, useRef } from 'react';
import { UploadCloud, File, Camera, X, ShieldAlert, Video, CheckCircle2, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { WebcamCaptureModal } from './WebcamCaptureModal';

interface DocumentUploaderProps {
  onUpload: (documentFile: File, referencePhoto: File | null, docTypeHint: string) => void;
  isProcessing: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, isProcessing }) => {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [refFile, setRefFile] = useState<File | null>(null);
  const [isLiveCaptured, setIsLiveCaptured] = useState<boolean>(false);
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState<boolean>(false);
  const [docTypeHint, setDocTypeHint] = useState<string>('passport');

  const docInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRefFile(e.target.files[0]);
      setIsLiveCaptured(false);
    }
  };

  const handleLiveCaptureSuccess = (capturedFile: File) => {
    setRefFile(capturedFile);
    setIsLiveCaptured(true);
  };

  const handleRemoveRefPhoto = () => {
    setRefFile(null);
    setIsLiveCaptured(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docFile) {
      onUpload(docFile, refFile, docTypeHint);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document File Uploader Card */}
          <div className="glass-panel p-6 border-dashed border-2 border-[#D6BB9B] dark:border-[#6B3E16] hover:border-[#8B5320] dark:hover:border-[#D39F67] transition-colors flex flex-col items-center justify-center text-center">
            <input
              ref={docInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleDocChange}
              className="hidden"
            />
            {docFile ? (
              <div className="w-full space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FDF7E4] dark:bg-[#382619] border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center text-[#8B5320] dark:text-[#D39F67] mx-auto">
                  <File className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm truncate max-w-xs mx-auto">{docFile.name}</p>
                  <p className="text-[11px] text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
                    {(docFile.size / (1024 * 1024)).toFixed(2)} MB • {docFile.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocFile(null)}
                  className="text-xs text-[#C0392B] hover:opacity-80 font-medium inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove Document
                </button>
              </div>
            ) : (
              <div className="space-y-3 cursor-pointer" onClick={() => docInputRef.current?.click()}>
                <div className="w-14 h-14 rounded-2xl bg-[#FDF7E4] dark:bg-[#382619] border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center text-[#8B5320] dark:text-[#D39F67] mx-auto shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm">Select Primary Document File</p>
                  <p className="text-xs text-[#8A715C] dark:text-[#C8A889] mt-1">Supports JPG, PNG, or PDF format (Max 10MB)</p>
                </div>
                <Button type="button" size="sm" variant="outline" className="pointer-events-none">
                  Browse Document File
                </Button>
              </div>
            )}
          </div>

          {/* Reference Identity Photo Uploader Card */}
          <div className="glass-panel p-6 border-dashed border-2 border-[#D6BB9B] dark:border-[#6B3E16] hover:border-[#8B5320] dark:hover:border-[#D39F67] transition-colors flex flex-col items-center justify-center text-center">
            <input
              ref={refInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleRefChange}
              className="hidden"
            />
            {refFile ? (
              <div className="w-full space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#E8F5EE] dark:bg-[#1B382B] border border-[#A3D9C3] dark:border-[#2E7D5E]/40 flex items-center justify-center text-[#2E7D5E] dark:text-[#A8E6CF] mx-auto">
                  {isLiveCaptured ? <UserCheck className="w-6 h-6 text-[#2E7D5E] dark:text-[#A8E6CF]" /> : <Camera className="w-6 h-6 text-[#2E7D5E] dark:text-[#A8E6CF]" />}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="font-semibold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm truncate max-w-xs">{refFile.name}</p>
                    {isLiveCaptured && (
                      <span className="text-[10px] bg-[#E8F5EE] text-[#2E7D5E] dark:bg-[#1B382B] dark:text-[#A8E6CF] border border-[#A3D9C3] dark:border-[#2E7D5E]/40 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2E7D5E]" /> Live Person Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
                    {isLiveCaptured ? 'Real-Time Webcam Snapshot Captured' : 'Reference Identity Photo File'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsWebcamModalOpen(true)}
                    className="text-xs text-[#8B5320] dark:text-[#D39F67] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" /> Re-capture Live
                  </button>
                  <span className="text-[#8A715C]">•</span>
                  <button
                    type="button"
                    onClick={handleRemoveRefPhoto}
                    className="text-xs text-[#C0392B] hover:opacity-80 font-medium inline-flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] dark:bg-[#1B382B] border border-[#A3D9C3] dark:border-[#2E7D5E]/40 flex items-center justify-center text-[#2E7D5E] dark:text-[#A8E6CF] mx-auto shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm">Reference Identity Photo</p>
                  <p className="text-xs text-[#8A715C] dark:text-[#C8A889] mt-1">Capture live webcam video or upload image for face matching</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsWebcamModalOpen(true)}
                    className="gap-1.5 text-xs shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Open Live Camera</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => refInputRef.current?.click()}
                    className="gap-1.5 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Selection & Submit Action */}
        <div className="glass-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-mono font-medium text-[#8A715C] dark:text-[#C8A889] whitespace-nowrap">
              Document Type Hint:
            </label>
            <select
              value={docTypeHint}
              onChange={(e) => setDocTypeHint(e.target.value)}
              className="bg-[#FAEED1] dark:bg-[#1C110A] border border-[#EEDCB2] dark:border-[#4A3324] text-[#2C1A0E] dark:text-[#F9EBD5] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B5320] dark:focus:border-[#D39F67] font-sans"
            >
              <option value="passport">Passport / Travel Document</option>
              <option value="visa">Entry Visa Permit</option>
              <option value="national_id">National Identity Card</option>
              <option value="driving_license">Driving License</option>
              <option value="permit">Residence / Work Permit</option>
              <option value="auto">Auto Detect Classification</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={!docFile || isProcessing}
            size="lg"
            className="w-full sm:w-auto gap-2 text-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Pipeline...' : 'Run Evidence Screening'}</span>
          </Button>
        </div>
      </form>

      {/* Live Camera Video Capture Modal */}
      <WebcamCaptureModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={handleLiveCaptureSuccess}
      />
    </>
  );
};
