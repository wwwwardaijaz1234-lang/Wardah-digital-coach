import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle, Sparkles } from 'lucide-react';
import { TestimonialItem } from '../types.ts';

interface StudentStoriesSectionProps {
  testimonials: TestimonialItem[];
}

export const StudentStoriesSection: React.FC<StudentStoriesSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testimonials.length]);

  return (
    <section id="stories" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AA78EF] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C3D7AE]" />
          <span>Real Transformations</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-heading mb-4">
          Student Stories
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Cinematic 3D carousel of genuine student breakthroughs. Housewives, beginners, and students
          sharing how practical digital mentorship reshaped their lives.
        </p>
      </div>

      {/* 3D Carousel Stage */}
      <div className="relative min-h-[460px] sm:min-h-[400px] flex items-center justify-center perspective-[1400px] overflow-hidden sm:overflow-visible">
        {testimonials.map((item, index) => {
          let offset = index - currentIndex;
          if (offset < -1) offset += testimonials.length;
          if (offset > 1) offset -= testimonials.length;

          const isActive = offset === 0;
          const isPrev = offset === -1 || (currentIndex === 0 && index === testimonials.length - 1);
          const isNext = offset === 1 || (currentIndex === testimonials.length - 1 && index === 0);

          let transformStyle = 'translate3d(0, 0, -300px) scale(0.6) opacity(0)';
          let zIndex = 0;
          let pointerEvents = 'none';

          if (isActive) {
            transformStyle = 'translate3d(0, 0, 0px) scale(1) rotateY(0deg)';
            zIndex = 30;
            pointerEvents = 'auto';
          } else if (isPrev) {
            transformStyle = 'translate3d(-55%, 0, -180px) scale(0.85) rotateY(22deg)';
            zIndex = 10;
            pointerEvents = 'auto';
          } else if (isNext) {
            transformStyle = 'translate3d(55%, 0, -180px) scale(0.85) rotateY(-22deg)';
            zIndex = 10;
            pointerEvents = 'auto';
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isPrev) prevSlide();
                if (isNext) nextSlide();
              }}
              style={{
                transform: transformStyle,
                zIndex,
                pointerEvents: pointerEvents as any,
                transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              className={`absolute w-full max-w-2xl rounded-3xl p-6 sm:p-10 glass-panel border transition-all cursor-pointer ${
                isActive
                  ? 'border-[#AA78EF]/60 shadow-[0_20px_60px_rgba(125,74,199,0.35)] bg-[#0F0F1A]/90'
                  : 'border-white/10 opacity-40 hover:opacity-70 bg-[#090A12]/80'
              }`}
            >
              {/* Header: Monogram Avatar + Rating + Verified Badge */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Floating 3D Monogram Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] p-[2px] shadow-lg shadow-purple-950/50">
                    <div className="w-full h-full rounded-[14px] bg-[#0F0F1A] flex items-center justify-center font-bold text-base text-[#C3D7AE] font-heading">
                      {item.initials}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#C3D7AE] font-medium">
                      {item.role} · {item.location}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-[#C3D7AE]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              {/* Concrete Outcome Tag */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#AA78EF]/15 border border-[#AA78EF]/30 text-xs font-semibold text-[#AA78EF]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{item.outcome}</span>
              </div>

              {/* Quote */}
              <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 italic">
                “{item.quote}”
              </blockquote>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{item.date}</span>
                <span className="text-[#C3D7AE] font-medium">{item.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Navigation Buttons & Indicators */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full glass-panel border border-white/10 hover:border-[#AA78EF]/50 text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Previous Testimonial"
          data-cursor-label="Prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-8 bg-gradient-to-r from-[#AA78EF] to-[#9AB088]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full glass-panel border border-white/10 hover:border-[#AA78EF]/50 text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Next Testimonial"
          data-cursor-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
