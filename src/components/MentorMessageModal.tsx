import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, MessageCircle, Sparkles, Play, Pause } from 'lucide-react';

interface MentorMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappGroupLink: string;
  heroImageUrl: string;
}

export const MentorMessageModal: React.FC<MentorMessageModalProps> = ({
  isOpen,
  onClose,
  whatsappGroupLink,
  heroImageUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-[#AA78EF]/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-panel text-slate-300 hover:text-white transition-colors"
          aria-label="Close message"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#AA78EF]/60 shadow-lg shrink-0">
            <img
              src={heroImageUrl}
              alt="Wardah Ijaz"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C3D7AE] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#AA78EF]" />
              <span>Personal Voice Note</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              A Personal Welcome from Wardah
            </h3>
            <p className="text-xs text-slate-400">Digital Skills Mentor & Career Guide</p>
          </div>
        </div>

        {/* Voice Note Visualizer Waveform */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#AA78EF] flex items-center justify-center text-white shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-[#C3D7AE]">
                {isPlaying ? 'Playing Message...' : 'Paused'}
              </span>
              <span className="font-mono">01:45</span>
            </div>

            {/* Animated Soundwave bars */}
            <div className="flex items-center gap-1 h-8">
              {[40, 70, 30, 90, 60, 45, 85, 100, 50, 65, 35, 80, 95, 40, 60, 85, 30, 75, 90, 45].map(
                (height, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-[#7D4AC7] to-[#C3D7AE]'
                        : 'bg-white/20'
                    }`}
                    style={{
                      height: isPlaying ? `${height}%` : '20%',
                      animation: isPlaying ? `pulse 1.2s ease-in-out infinite ${i * 0.05}s` : 'none',
                    }}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Written Message Transcript */}
        <div className="text-sm text-slate-200 leading-relaxed mb-6 space-y-3 font-sans">
          <p className="italic text-[#C3D7AE] font-medium font-heading">
            “Assalam-o-Alaikum! Main Wardah Ijaz hoon. Agar aap student hain, housewife hain, ya bilkul
            beginner hain — toh pehli baat ye jaan lein ke aap der se nahi shuru kar rahe.”
          </p>
          <p className="text-slate-300 text-xs sm:text-sm">
            “Digital skills seekhna koi rocket science nahi hai jab aapke paas aik step-by-step
            system aur guidance ho. Hamari community mein hum har week live milte hain aur mil kar
            haath se kaam karte hain. Mujhe aapko grow karte dekhna hai!”
          </p>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#AA78EF] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-purple-900/50"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Mentorship Circle</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
