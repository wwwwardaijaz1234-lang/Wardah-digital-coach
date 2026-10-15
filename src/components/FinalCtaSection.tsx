import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalCtaSectionProps {
  headline: string;
  subtext: string;
  whatsappGroupLink: string;
  brandName: string;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  headline,
  subtext,
  whatsappGroupLink,
  brandName,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#AA78EF', '#C3D7AE', '#FFFFFF', '#7D4AC7'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section className="relative py-32 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden text-center">
      {/* Converging Aurora and Portal Light in the center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-radial from-[#7D4AC7]/30 via-[#9AB088]/15 to-transparent blur-3xl transition-transform duration-700 ${
            isHovered ? 'scale-125 opacity-90' : 'scale-100 opacity-60'
          }`}
        />
      </div>

      {/* Floating 3D Portal Halo Ring */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#C3D7AE] mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#AA78EF]" />
          <span>Step Into Your Future</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.08] font-heading mb-6">
          {headline}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto mb-10">
          {subtext}
        </p>

        {/* Grand Portal CTA Button */}
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] blur-xl transition-all duration-500 opacity-60 ${
              isHovered ? 'opacity-100 blur-2xl scale-110' : ''
            }`}
          />

          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] text-white font-bold text-base tracking-wide border border-white/25 shadow-2xl shadow-purple-950/80 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            data-cursor-label="Begin"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>Join Free Mentorship Today</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs text-slate-400 mt-6 font-mono">
          Limited batch seats · Safe community · Direct 1:1 guidance
        </p>
      </div>

      {/* Luxury Brand Minimal Footer */}
      <footer className="mt-28 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white font-heading">{brandName}</span>
          <span>· Empowering the Next Generation of Independent Earners</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a href="#why" className="hover:text-white transition-colors">Philosophy</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#method" className="hover:text-white transition-colors">Method</a>
          <a href="#stories" className="hover:text-white transition-colors">Stories</a>
        </div>
      </footer>
    </section>
  );
};
