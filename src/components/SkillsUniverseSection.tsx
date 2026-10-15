import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  X,
  CheckCircle2,
  Clock,
  DollarSign,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { SkillGalaxyCanvas } from './3d/SkillGalaxyCanvas.tsx';
import { SkillItem } from '../types.ts';

interface SkillsUniverseSectionProps {
  skills: SkillItem[];
  whatsappGroupLink: string;
}

export const SkillsUniverseSection: React.FC<SkillsUniverseSectionProps> = ({
  skills,
  whatsappGroupLink,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skills[0]?.id || null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  return (
    <section id="skills" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AA78EF] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C3D7AE]" />
            <span>Interactive 3D Constellation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-heading">
            The Skills Universe
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            A futuristic 3D learning galaxy. Orbiting nodes represent high-earning crafts. Click any
            celestial orb to inspect its comprehensive roadmap.
          </p>
        </div>

        {/* Quick Skill Selector Strip */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7D4AC7] to-[#AA78EF] text-white shadow-lg shadow-purple-900/40 border border-white/20'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-[#AA78EF]/30'
                }`}
                data-cursor-hover
              >
                {skill.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Constellation Viewport */}
      <div className="mb-12">
        <SkillGalaxyCanvas
          skills={skills}
          selectedSkillId={selectedSkillId}
          onSelectSkill={(id) => setSelectedSkillId(id)}
          onHoverSkill={(id) => setHoveredSkillId(id)}
        />
      </div>

      {/* Holographic Expanded Detailed Panel for the Selected Skill */}
      {selectedSkill && (
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-[#AA78EF]/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#AA78EF]/20 text-[#AA78EF] border border-[#AA78EF]/30">
                  {selectedSkill.category}
                </span>
                <span className="text-xs text-slate-400">· {selectedSkill.shortTag}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-3">
                {selectedSkill.name}
              </h3>
              <p className="text-base text-slate-200 leading-relaxed max-w-2xl">
                {selectedSkill.description}
              </p>
              <p className="text-sm italic text-[#C3D7AE] mt-3 font-medium">
                “{selectedSkill.urduSummary}”
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-4 shrink-0 sm:w-80">
              <div className="glass-panel rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#C3D7AE]" />
                  <span>Earning Range</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white font-heading">
                  {selectedSkill.earningPotential}
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#AA78EF]" />
                  <span>Duration</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white font-heading">
                  {selectedSkill.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum & Tools Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
            {/* Curriculum Highlights (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C3D7AE] font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                <span>What You Will Master</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSkill.curriculumHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C3D7AE] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Software / Tools & Action CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#AA78EF] font-semibold mb-4">
                  <Wrench className="w-4 h-4" />
                  <span>Tools & Stack</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedSkill.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/10 text-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#AA78EF] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-purple-900/40"
                  data-cursor-label="Apply"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>Inquire for {selectedSkill.name}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
