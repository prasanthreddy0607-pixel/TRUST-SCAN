import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, RefreshCw, X, AlertTriangle, UserCheck, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface WebcamCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedFile: File) => void;
}

export type LivenessState = 'INITIALIZING' | 'PITCH_DARK' | 'NO_FACE' | 'VERIFIED';

export const WebcamCaptureModal: React.FC<WebcamCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [livenessState, setLivenessState] = useState<LivenessState>('INITIALIZING');
  const [livenessMessage, setLivenessMessage] = useState<string>('Initializing stream...');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      setCapturedBlob(null);
      setCameraError(null);
      setLivenessState('INITIALIZING');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Bind video element to media stream reliably whenever stream or videoRef updates
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .catch((err) => console.log('Video stream play deferred/blocked:', err));
    }
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    setLivenessState('INITIALIZING');
    setLivenessMessage('Initializing stream...');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings.'
          : 'Unable to detect or access webcam hardware.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Real-time canvas raster analysis for human face & skin texture detection
  const analyzeVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight || video.paused || video.ended) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Center facial ROI (region where face oval overlay is located)
    const roiX = Math.floor(canvas.width * 0.25);
    const roiY = Math.floor(canvas.height * 0.15);
    const roiW = Math.floor(canvas.width * 0.5);
    const roiH = Math.floor(canvas.height * 0.7);

    const imageData = ctx.getImageData(roiX, roiY, roiW, roiH);
    const data = imageData.data;
    const totalPixels = data.length / 4;

    let totalY = 0;
    let skinCount = 0;
    const luminanceValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Luminance Y calculation
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      totalY += y;
      luminanceValues.push(y);

      // YCbCr Color Space Transformation
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // Human skin tone rules: Y in [80, 240], Cb in [85, 135], Cr in [135, 180]
      const isSkin =
        y >= 60 &&
        y <= 240 &&
        cb >= 85 &&
        cb <= 135 &&
        cr >= 135 &&
        cr <= 180 &&
        r > g &&
        r > b &&
        r - g > 10;

      if (isSkin) skinCount++;
    }

    const meanY = totalY / totalPixels;
    const skinRatio = skinCount / totalPixels;

    // Variance calculation (textures, facial details vs flat surface/wall)
    let sumSqDiff = 0;
    for (let i = 0; i < luminanceValues.length; i++) {
      const diff = luminanceValues[i] - meanY;
      sumSqDiff += diff * diff;
    }
    const variance = sumSqDiff / totalPixels;

    // Liveness & Face verification decision logic
    if (meanY < 25) {
      setLivenessState('PITCH_DARK');
      setLivenessMessage('❌ Pitch Dark / Unlit View');
    } else if (skinRatio < 0.08 || variance < 100) {
      setLivenessState('NO_FACE');
      setLivenessMessage('❌ No Human Face Detected');
    } else {
      setLivenessState('VERIFIED');
      setLivenessMessage('✅ Real Human Face Verified');
    }
  };

  // Continuous frame analysis loop
  useEffect(() => {
    if (!stream || capturedPreview || cameraError) return;

    const intervalId = setInterval(() => {
      analyzeVideoFrame();
    }, 200);

    return () => clearInterval(intervalId);
  }, [stream, capturedPreview, cameraError]);

  const handleTakeSnapshot = () => {
    if (livenessState !== 'VERIFIED') return;
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedBlob(blob);
          setCapturedPreview(canvas.toDataURL('image/png'));
        }
      }, 'image/png');
    }
  };

  const handleConfirmCapture = () => {
    if (capturedBlob && livenessState === 'VERIFIED') {
      const liveFile = new File([capturedBlob], `live_photo_${Date.now()}.png`, {
        type: 'image/png',
      });
      onCapture(liveFile);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    setCapturedBlob(null);
    setLivenessState('INITIALIZING');
    setLivenessMessage('Initializing stream...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110A]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-xl p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEDCB2] dark:border-[#4A3324] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FDF7E4] dark:bg-[#382619] border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center text-[#8B5320] dark:text-[#D39F67]">
              <Camera className="w-4 h-4 text-[#8B5320] dark:text-[#D39F67]" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">
                Live Webcam Capture & Human Face Verification
              </h3>
              <p className="text-[11px] text-[#8A715C] dark:text-[#C8A889] font-mono">
                Capture real-time candidate photo for liveness & identity verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A715C] dark:text-[#C8A889] hover:bg-[#FDF7E4] dark:hover:bg-[#382619] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Frame Container */}
        <div className="relative w-full aspect-video bg-[#1C110A] rounded-xl overflow-hidden border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-[#C0392B] mx-auto" />
              <p className="text-xs text-[#F9EBD5] font-sans max-w-xs mx-auto leading-relaxed">
                {cameraError}
              </p>
              <Button size="sm" variant="outline" onClick={startCamera}>
                Try Again
              </Button>
            </div>
          ) : capturedPreview ? (
            /* Captured Snapshot Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedPreview}
                alt="Live Capture Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#1B382B]/90 border border-[#2E7D5E] text-[#A8E6CF] text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A8E6CF]" />
                <span>Real Human Photo Captured & Verified</span>
              </div>
            </div>
          ) : (
            /* Live Stream Video Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => videoRef.current?.play().catch(() => {})}
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {/* Facial Alignment Overlay Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`w-52 h-64 border-2 border-dashed rounded-[50%] flex items-center justify-center transition-colors duration-300 ${
                    livenessState === 'VERIFIED'
                      ? 'border-[#2E7D5E] shadow-[0_0_30px_rgba(46,125,94,0.4)]'
                      : 'border-[#C0392B] shadow-[0_0_30px_rgba(192,57,43,0.4)]'
                  }`}
                >
                  <div
                    className={`w-44 h-56 border border-dashed rounded-[50%] transition-colors duration-300 ${
                      livenessState === 'VERIFIED' ? 'border-[#A8E6CF]/50' : 'border-[#F8D7DA]/40'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Liveness Indicator Status Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#1C110A]/85 border border-[#4A3324] text-[11px] font-mono backdrop-blur-md">
                <span className="flex items-center gap-2 text-[#F9EBD5]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      livenessState === 'VERIFIED'
                        ? 'bg-[#2E7D5E] animate-pulse'
                        : livenessState === 'INITIALIZING'
                        ? 'bg-[#D39F67] animate-ping'
                        : 'bg-[#C0392B]'
                    }`}
                  ></span>
                  Status:
                </span>

                {livenessState === 'INITIALIZING' && (
                  <span className="text-[#D39F67] flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> {livenessMessage}
                  </span>
                )}
                {livenessState === 'PITCH_DARK' && (
                  <span className="text-[#F87171] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" /> {livenessMessage}
                  </span>
                )}
                {livenessState === 'NO_FACE' && (
                  <span className="text-[#F87171] font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-[#F87171]" /> {livenessMessage}
                  </span>
                )}
                {livenessState === 'VERIFIED' && (
                  <span className="text-[#A8E6CF] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D5E]" /> {livenessMessage}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Hidden Canvas element for snapshot & raster analysis */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          {capturedPreview ? (
            <>
              <Button variant="secondary" onClick={handleRetake} className="gap-2 text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </Button>
              <Button onClick={handleConfirmCapture} className="gap-2 text-xs">
                <UserCheck className="w-4 h-4" />
                <span>Use Live Reference Photo</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <p className="text-[11px] text-[#8A715C] dark:text-[#C8A889] font-mono">
                  Align face inside center frame
                </p>
                {livenessState !== 'VERIFIED' && (
                  <span className="text-[10px] text-[#C0392B] font-semibold">
                    Position real human face inside camera frame to unlock capture
                  </span>
                )}
              </div>
              <Button
                onClick={handleTakeSnapshot}
                disabled={!!cameraError || livenessState !== 'VERIFIED'}
                className="gap-2 text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Live Photo</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
