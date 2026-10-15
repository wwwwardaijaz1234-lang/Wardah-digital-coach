export interface SkillItem {
  id: string;
  name: string;
  shortTag: string;
  category: string;
  iconName: string;
  description: string;
  urduSummary: string;
  tools: string[];
  earningPotential: string;
  duration: string;
  curriculumHighlights: string[];
  color: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarUrl?: string;
  initials: string;
  outcome: string;
  quote: string;
  rating: number;
  highlight: string;
  date: string;
}

export interface GrowthStep {
  step: string;
  title: string;
  description: string;
  urduQuote: string;
  tag: string;
}

export interface SiteContent {
  brandName: string;
  mentorTitle: string;
  eyebrow: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroHeadlineSuffix: string;
  heroSupportingLine: string;
  heroDescription: string;
  heroUrduNote: string;
  heroImageUrl: string;
  whatsappNumber: string;
  whatsappGroupLink: string;
  floatingQuote: string;
  stats: {
    studentsMentored: string;
    studentSatisfaction: string;
    highDemandSkillsCount: string;
    liveSupport: string;
  };
  whyCards: {
    id: string;
    title: string;
    subtitle: string;
    urduText: string;
    description: string;
    icon: string;
    stat: string;
  }[];
  skills: SkillItem[];
  growthSteps: GrowthStep[];
  testimonials: TestimonialItem[];
  finalCtaHeadline: string;
  finalCtaSubtext: string;
  theme: {
    accentViolet: string;
    accentSage: string;
    deepViolet: string;
  };
}
