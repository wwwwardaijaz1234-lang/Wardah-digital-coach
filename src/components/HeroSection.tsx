import React from 'react';
import { ArrowRight, MessageCircle, Volume2, ShieldCheck, Sparkles, Camera } from 'lucide-react';
import { HeroPortalCanvas } from './3d/HeroPortalCanvas.tsx';
import { SiteContent } from '../types.ts';

interface HeroSectionProps {
  content: SiteContent;
  onOpenMentorModal: () => void;
  onUpdateHeroImage?: (newUrl: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  onOpenMentorModal,
  onUpdateHeroImage,
}) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* 3D WebGL Glass Portal Scene in the Background / Right Side */}
      <HeroPortalCanvas heroImageUrl={content.heroImageUrl} />

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Cinematic Typography & Layered Reveals (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start max-w-2xl">
            {/* Layer 1: Eyebrow Line */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#C3D7AE] mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#AA78EF]" />
              <span>{content.eyebrow}</span>
            </div>

            {/* Layer 2 & 3: Main Headline with Italic Highlight (Helvetica font) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6 font-heading">
              {content.heroHeadlinePrefix}{' '}
              <span className="italic font-serif font-normal text-gradient-violet-sage px-1 inline-block transform -skew-x-3">
                {content.heroHeadlineHighlight}
              </span>{' '}
              {content.heroHeadlineSuffix}
            </h1>

            {/* Layer 4: Supporting Line (Roman Urdu) */}
            <p className="text-lg sm:text-xl font-medium text-[#C3D7AE] mb-4 leading-relaxed font-heading">
              {content.heroSupportingLine}
            </p>

            {/* Layer 5: Description */}
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed font-sans max-w-xl">
              {content.heroDescription}
            </p>

            {/* Layer 6: Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <a
                href={content.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] text-white font-bold text-sm tracking-wide shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/60 transition-all hover:scale-[1.03] active:scale-[0.98] border border-white/20"
                data-cursor-label="VIP Access"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Join Free WhatsApp VIP</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#skills"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white hover:border-[#AA78EF]/50 font-semibold text-sm transition-all hover:bg-white/[0.08]"
                data-cursor-label="Orbit"
              >
                <span>Explore {content.skills.length} High-Demand Skills</span>
              </a>

              <button
                type="button"
                onClick={onOpenMentorModal}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#C3D7AE] hover:text-white transition-colors py-2 px-1"
                data-cursor-label="Listen"
              >
                <Volume2 className="w-4 h-4 text-[#AA78EF]" />
                <span className="underline underline-offset-4">Mentor Message</span>
              </button>
            </div>

            {/* Layer 7: Social Proof & Trust Badges */}
            <div className="w-full pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading tabular-nums">
                  {content.stats.studentsMentored}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-0.5">
                  Learners Mentored
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#C3D7AE] tracking-tight font-heading tabular-nums">
                  {content.stats.studentSatisfaction}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-0.5">
                  Success Rating
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#AA78EF] tracking-tight font-heading tabular-nums">
                  {content.stats.highDemandSkillsCount.split(' ')[0]}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-0.5">
                  Monetizable Tracks
                </p>
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-[#C3D7AE]" />
                  <span>100% Practical</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-0.5">
                  Safe & Empowering
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile-only visible preview or desktop 3D pointer prompt (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center lg:items-end">
            <div className="hidden lg:flex flex-col items-end gap-3 text-right pr-6 select-none">
              <span className="text-[11px] uppercase tracking-widest text-[#AA78EF]/80 font-mono">
                [ 3D Living Portal Active ]
              </span>
              <span className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Move pointer to inspect holographic lighting, refraction & orbiting nodes
              </span>

              {onUpdateHeroImage && (
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white cursor-pointer border border-white/10 hover:border-[#AA78EF]/50 transition-colors shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-[#C3D7AE]" />
                  <span>Upload Original Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            onUpdateHeroImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
