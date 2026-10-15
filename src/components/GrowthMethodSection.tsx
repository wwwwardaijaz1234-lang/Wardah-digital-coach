import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { GrowthPrismCanvas } from './3d/GrowthPrismCanvas.tsx';
import { SiteContent } from '../types.ts';

interface GrowthMethodSectionProps {
  content: SiteContent;
}

export const GrowthMethodSection: React.FC<GrowthMethodSectionProps> = ({ content }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="method" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C3D7AE] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#AA78EF]" />
          <span>The Four Pillars</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-heading mb-4">
          The Growth Method
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Inspired by a multi-faceted optical crystal prism. Each face reflects an uncompromising
          pillar of Wardah Ijaz’s real-world mentorship.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: 3D Rotating Prism Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <GrowthPrismCanvas
            activeStep={activeStep}
            onStepChange={(newStep) => setActiveStep(newStep)}
          />
        </div>

        {/* Right Column: Interactive 4 Pillars List (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {content.growthSteps.map((item, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'glass-panel-elevated border-[#AA78EF]/60 shadow-[0_10px_30px_rgba(125,74,199,0.25)] translate-x-2'
                    : 'glass-panel border-white/5 hover:border-white/15 opacity-70 hover:opacity-100'
                }`}
                data-cursor-label={`Pillar ${item.step}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold font-mono px-2.5 py-1 rounded-lg ${
                        isActive
                          ? 'bg-[#AA78EF] text-white shadow-md'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {item.step}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C3D7AE] shrink-0">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-10 mb-2">
                  {item.description}
                </p>

                <p className="text-xs italic text-[#C3D7AE] pl-10 font-medium">
                  “{item.urduQuote}”
                </p>

                {isActive && (
                  <div className="absolute right-4 bottom-4 text-[#AA78EF] hidden sm:block">
                    <ChevronRight className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
