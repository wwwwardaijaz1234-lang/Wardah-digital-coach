import React, { useState } from 'react';
import { MessageCircle, ArrowRight, Users, Shield, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityBadgeCanvas } from './3d/CommunityBadgeCanvas.tsx';

interface CommunitySectionProps {
  whatsappGroupLink: string;
  whatsappNumber: string;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  whatsappGroupLink,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCtaClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#AA78EF', '#9AB088', '#C3D7AE', '#7D4AC7'],
      });
    } catch {
      // safe fallback if confetti fails
    }
  };

  return (
    <section id="community" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background soft ambient halo */}
      <div className="absolute inset-0 bg-radial from-[#7D4AC7]/15 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="relative glass-panel rounded-3xl p-8 sm:p-14 border border-[#9AB088]/30 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3D Community Circular Badge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <CommunityBadgeCanvas isHovered={isHovered} />
          </div>

          {/* Right Column: Portal Copy & Magnetic CTA (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9AB088]/15 border border-[#9AB088]/30 text-xs font-semibold uppercase tracking-widest text-[#C3D7AE] mb-4">
              <Users className="w-3.5 h-3.5 text-[#C3D7AE]" />
              <span>Official Mentorship Circle</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-heading mb-4">
              Join The Wardah Ijaz Community
            </h2>

            <p className="text-base sm:text-lg text-[#C3D7AE] font-medium mb-4 leading-relaxed font-heading">
              Aapki digital journey akele chalne ke liye nahi hai. Join our safe, uplifting circle.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-xl">
              Get instant access to weekly live Zoom/Google Meet screen shares, portfolio critiques,
              freelance proposal templates, and direct guidance from Wardah Ijaz.
            </p>

            {/* Benefit Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-xl">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Zap className="w-4 h-4 text-[#AA78EF]" />
                <span>Weekly Live 1:1 Q&A Sessions</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Shield className="w-4 h-4 text-[#C3D7AE]" />
                <span>100% Safe Female-Friendly Circle</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Users className="w-4 h-4 text-[#C3D7AE]" />
                <span>Real Client Job Referrals</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Sparkles className="w-4 h-4 text-[#AA78EF]" />
                <span>Completely Free to Enter</span>
              </div>
            </div>

            {/* WhatsApp Portal Button with Magnetic & Ripple Styling */}
            <div
              className="relative inline-block w-full sm:w-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#9AB088] via-[#AA78EF] to-[#C3D7AE] opacity-50 blur-lg transition-all duration-300 ${
                  isHovered ? 'opacity-90 blur-xl scale-105' : ''
                }`}
              />

              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#0F0F1A] hover:bg-gradient-to-r hover:from-[#1b251e] hover:to-[#251936] text-white font-bold text-sm tracking-wide border border-white/20 shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                data-cursor-label="Connect"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-[#C3D7AE]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider text-slate-400 font-normal">
                    Direct Community Access
                  </span>
                  <span className="block text-sm font-bold text-white">
                    Enter WhatsApp VIP Portal
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C3D7AE] ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
