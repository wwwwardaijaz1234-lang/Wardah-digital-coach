import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, MessageCircle, Sliders } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  whatsappGroupLink: string;
  onOpenEditDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  whatsappGroupLink,
  onOpenEditDrawer,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple scroll spy
      const sections = ['why', 'skills', 'method', 'community', 'stories'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Why Skills', href: '#why', id: 'why' },
    { label: 'Universe', href: '#skills', id: 'skills' },
    { label: 'Method', href: '#method', id: 'method' },
    { label: 'Stories', href: '#stories', id: 'stories' },
    { label: 'Community', href: '#community', id: 'community' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3 sm:py-4 ${
          isScrolled ? 'backdrop-blur-xl bg-[#090A12]/80 border-b border-white/5 py-3' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-3 group whitespace-nowrap shrink-0"
            data-cursor-label="Wardah"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] p-[1px] shadow-lg shadow-purple-900/30">
              <div className="w-full h-full bg-[#0F0F1A] rounded-[7px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <span className="text-xs font-bold text-[#C3D7AE]">WI</span>
              </div>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-heading">
              {brandName}
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 transition-colors hover:text-white whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#C3D7AE] font-semibold' : 'text-slate-400'
                  }`}
                  data-cursor-hover
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#AA78EF] to-[#9AB088] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Drawer Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Edit Drawer Trigger */}
            <button
              onClick={onOpenEditDrawer}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-[#AA78EF]/40 transition-colors"
              title="Customize Content & Branding"
              aria-label="Edit Page Content"
              data-cursor-label="Edit"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#5B2C6F] hover:from-[#AA78EF] hover:to-[#7D4AC7] border border-white/10 shadow-lg shadow-purple-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
              data-cursor-label="Join"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C3D7AE]" />
              <span>Join Free VIP</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-panel text-slate-300 hover:text-white"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Immersive Mobile 3D Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#090A12]/95 backdrop-blur-2xl flex flex-col justify-between p-8 pt-24 md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-[#AA78EF] font-semibold">
              Navigation
            </span>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-2xl font-bold text-white hover:text-[#C3D7AE] transition-colors font-heading py-1 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#5B2C6F] text-white font-semibold text-sm shadow-xl"
            >
              <MessageCircle className="w-4 h-4 text-[#C3D7AE]" />
              <span>Join WhatsApp Community</span>
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEditDrawer();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl glass-panel text-slate-300 text-sm font-medium"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize Content</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
