import React, { useState, useEffect } from 'react';
import { DEFAULT_CONTENT } from './constants/defaultContent.ts';
import { SiteContent } from './types.ts';
import { GlobalAtmosphereCanvas } from './components/3d/GlobalAtmosphereCanvas.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { WhySkillsSection } from './components/WhySkillsSection.tsx';
import { SkillsUniverseSection } from './components/SkillsUniverseSection.tsx';
import { GrowthMethodSection } from './components/GrowthMethodSection.tsx';
import { CommunitySection } from './components/CommunitySection.tsx';
import { StudentStoriesSection } from './components/StudentStoriesSection.tsx';
import { FinalCtaSection } from './components/FinalCtaSection.tsx';
import { EditDrawer } from './components/EditDrawer.tsx';
import { MentorMessageModal } from './components/MentorMessageModal.tsx';

export default function App() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  // Load persisted user edits on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wardah_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the saved object contains the old generated image, automatically migrate to the exact portrait
        if (!parsed.heroImageUrl || parsed.heroImageUrl.includes('wardah_hero_portrait')) {
          parsed.heroImageUrl = DEFAULT_CONTENT.heroImageUrl;
        }
        // If the saved object contains the placeholder WhatsApp link, update to the actual community group
        if (!parsed.whatsappGroupLink || parsed.whatsappGroupLink.includes('wardah-mentorship-vip')) {
          parsed.whatsappGroupLink = DEFAULT_CONTENT.whatsappGroupLink;
        }
        // Ensure new AI skills are included even if previous session had fewer skills
        if (!parsed.skills || parsed.skills.length < DEFAULT_CONTENT.skills.length) {
          parsed.skills = DEFAULT_CONTENT.skills;
          parsed.stats = {
            ...parsed.stats,
            highDemandSkillsCount: DEFAULT_CONTENT.stats.highDemandSkillsCount,
          };
        }
        setContent((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch {
      // ignore JSON parse errors and continue with defaults
    }
  }, []);

  const handleUpdateContent = (updated: SiteContent) => {
    setContent(updated);
  };

  const handleResetDefaults = () => {
    setContent(DEFAULT_CONTENT);
  };

  return (
    <div className="relative min-h-screen bg-[#090A12] text-slate-100 selection:bg-[#7D4AC7] selection:text-white">
      {/* 3D Global Atmospheric Universe Canvas */}
      <GlobalAtmosphereCanvas />

      {/* Cinematic Custom Spring Cursor */}
      <CustomCursor />

      {/* Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Floating Glass Navigation Bar */}
      <Navbar
        brandName={content.brandName}
        whatsappGroupLink={content.whatsappGroupLink}
        onOpenEditDrawer={() => setIsEditDrawerOpen(true)}
      />

      {/* Main Interactive Sections */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section with 3D Glass Portal & Layered Typography */}
        <HeroSection
          content={content}
          onOpenMentorModal={() => setIsMentorModalOpen(true)}
          onUpdateHeroImage={(newUrl) => {
            setContent((prev) => {
              const updated = { ...prev, heroImageUrl: newUrl };
              localStorage.setItem('wardah_site_content', JSON.stringify(updated));
              return updated;
            });
          }}
        />

        {/* Section 1: Why Digital Skills with 3D Physical Tilt Cards */}
        <WhySkillsSection content={content} />

        {/* Section 2: Skills Universe 3D Constellation & Celestial Orbs */}
        <SkillsUniverseSection
          skills={content.skills}
          whatsappGroupLink={content.whatsappGroupLink}
        />

        {/* Section 3: The Growth Method with 3D Rotating Prism Crystal */}
        <GrowthMethodSection content={content} />

        {/* Section 4: Community Circle with 3D Interactive Circular Badge */}
        <CommunitySection
          whatsappGroupLink={content.whatsappGroupLink}
          whatsappNumber={content.whatsappNumber}
        />

        {/* Section 5: Student Stories 3D Depth Testimonials Carousel */}
        <StudentStoriesSection testimonials={content.testimonials} />

        {/* Dramatic Final CTA with Converging Aurora */}
        <FinalCtaSection
          headline={content.finalCtaHeadline}
          subtext={content.finalCtaSubtext}
          whatsappGroupLink={content.whatsappGroupLink}
          brandName={content.brandName}
        />
      </main>

      {/* No-Code Edit Page Drawer */}
      <EditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        content={content}
        onUpdateContent={handleUpdateContent}
        onResetDefaults={handleResetDefaults}
      />

      {/* Mentor Greeting Audio Modal */}
      <MentorMessageModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
        whatsappGroupLink={content.whatsappGroupLink}
        heroImageUrl={content.heroImageUrl}
      />
    </div>
  );
}
