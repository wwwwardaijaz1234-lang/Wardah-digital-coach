import React, { useState } from 'react';
import { ShieldCheck, Layers, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { SiteContent } from '../types.ts';

interface WhySkillsSectionProps {
  content: SiteContent;
}

interface TiltState {
  x: number;
  y: number;
  shineX: number;
  shineY: number;
}

export const WhySkillsSection: React.FC<WhySkillsSectionProps> = ({ content }) => {
  const [tilt, setTilt] = useState<{ [key: string]: TiltState }>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt((prev) => ({
      ...prev,
      [cardId]: {
        x: rotateX,
        y: rotateY,
        shineX: (x / rect.width) * 100,
        shineY: (y / rect.height) * 100,
      },
    }));
  };

  const handleMouseLeave = (cardId: string) => {
    setTilt((prev) => ({
      ...prev,
      [cardId]: { x: 0, y: 0, shineX: 50, shineY: 50 },
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#C3D7AE]" />;
      case 'Layers':
        return <Layers className="w-8 h-8 text-[#AA78EF]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-8 h-8 text-[#C3D7AE]" />;
    }
  };

  return (
    <section id="why" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Holographic Floating Quote in Space */}
      <div className="relative mb-24 text-center max-w-4xl mx-auto">
        <div className="absolute -inset-x-8 -top-12 -bottom-12 bg-gradient-to-r from-[#AA78EF]/10 via-[#9AB088]/15 to-[#5B2C6F]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative glass-panel rounded-3xl p-8 sm:p-12 border border-[#AA78EF]/30 shadow-2xl shadow-purple-950/40">
          <span className="text-xs uppercase tracking-widest text-[#AA78EF] font-semibold mb-3 block">
            Guiding Philosophy
          </span>
          <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading tracking-tight">
            “{content.floatingQuote}”
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-wider text-[#C3D7AE]">
            <span className="w-8 h-[1px] bg-[#C3D7AE]/40" />
            <span>Wardah Ijaz · Personal Mentorship Philosophy</span>
            <span className="w-8 h-[1px] bg-[#C3D7AE]/40" />
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C3D7AE] font-semibold block mb-2">
          The Purpose
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-heading mb-4">
          Kyun Seekhein Digital Skills?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Physical glass cards designed with tactile depth. Hover to experience physical 3D tilt,
          specular reflections, and outcome metrics.
        </p>
      </div>

      {/* 3 Physical Glass Cards with 3D Matrix Perspective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1200px]">
        {content.whyCards.map((card) => {
          const cardTilt = tilt[card.id] || { x: 0, y: 0, shineX: 50, shineY: 50 };
          return (
            <div
              key={card.id}
              onMouseMove={(e) => handleMouseMove(e, card.id)}
              onMouseLeave={() => handleMouseLeave(card.id)}
              style={{
                transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateZ(${
                  cardTilt.x !== 0 ? '30px' : '0px'
                })`,
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
              }}
              className="group relative rounded-3xl p-8 glass-panel border border-white/10 hover:border-[#AA78EF]/50 shadow-xl hover:shadow-[0_20px_50px_rgba(125,74,199,0.25)] flex flex-col justify-between overflow-hidden cursor-pointer will-change-transform"
              data-cursor-label="Discover"
            >
              {/* Dynamic Specular Light Sweep */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{
                  background: `radial-gradient(circle at ${cardTilt.shineX}% ${cardTilt.shineY}%, rgba(195,215,174,0.18), transparent 60%)`,
                }}
              />

              <div>
                {/* Rotating 3D Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                    {getIcon(card.icon)}
                  </div>
                  <span className="text-xs font-semibold text-[#C3D7AE] tracking-wide">
                    {card.stat}
                  </span>
                </div>

                {/* Title (Helvetica) */}
                <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-tight group-hover:text-[#C3D7AE] transition-colors">
                  {card.title}
                </h3>

                {/* Subtitle & Roman Urdu Quote */}
                <p className="text-xs uppercase tracking-wider text-[#AA78EF] font-medium mb-3">
                  {card.subtitle}
                </p>

                <p className="text-sm font-medium text-slate-200 mb-4 italic leading-relaxed">
                  “{card.urduText}”
                </p>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C3D7AE]" />
                  <span>Real World Ready</span>
                </span>
                <span className="text-[#AA78EF] font-semibold group-hover:translate-x-1 transition-transform">
                  Learn More →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
