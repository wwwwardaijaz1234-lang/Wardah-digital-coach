import React, { useState } from 'react';
import { X, Save, RotateCcw, Image, MessageSquare, Type, Palette, CheckCircle2, Upload } from 'lucide-react';
import { SiteContent } from '../types.ts';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: SiteContent;
  onUpdateContent: (updated: SiteContent) => void;
  onResetDefaults: () => void;
}

export const EditDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  onClose,
  content,
  onUpdateContent,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<SiteContent>(content);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync if content changes externally
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  if (!isOpen) return null;

  const handleTextChange = (field: keyof SiteContent, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleTextChange('heroImageUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateContent(formData);
    localStorage.setItem('wardah_site_content', JSON.stringify(formData));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all content and imagery to default settings?')) {
      onResetDefaults();
      localStorage.removeItem('wardah_site_content');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F1A] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Customize Page Content
              </h2>
              <p className="text-xs text-slate-400">
                Live editor with instant preview &amp; local storage
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white"
              aria-label="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Fields Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved successfully to localStorage!</span>
              </div>
            )}

            {/* 1. Hero Image Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C3D7AE] font-semibold">
                <Image className="w-4 h-4" />
                <span>Hero Mentor Image</span>
              </div>

              {/* Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20">
                <img
                  src={formData.heroImageUrl}
                  alt="Hero Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.heroImageUrl}
                  onChange={(e) => handleTextChange('heroImageUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                  placeholder="https://... or /src/assets/..."
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Or Upload Local Image</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-xl glass-panel text-slate-300 hover:text-white cursor-pointer border border-dashed border-white/20 hover:border-[#AA78EF]/60 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose file from device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 2. Hero Typography */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#AA78EF] font-semibold">
                <Type className="w-4 h-4" />
                <span>Hero Headlines</span>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Headline Prefix</label>
                <input
                  type="text"
                  value={formData.heroHeadlinePrefix}
                  onChange={(e) => handleTextChange('heroHeadlinePrefix', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Highlight Word (Italic)
                </label>
                <input
                  type="text"
                  value={formData.heroHeadlineHighlight}
                  onChange={(e) => handleTextChange('heroHeadlineHighlight', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Headline Suffix</label>
                <input
                  type="text"
                  value={formData.heroHeadlineSuffix}
                  onChange={(e) => handleTextChange('heroHeadlineSuffix', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Supporting Line (Roman Urdu)
                </label>
                <input
                  type="text"
                  value={formData.heroSupportingLine}
                  onChange={(e) => handleTextChange('heroSupportingLine', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={formData.heroDescription}
                  onChange={(e) => handleTextChange('heroDescription', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>
            </div>

            {/* 3. Floating Philosophy Quote */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-xs uppercase tracking-wider text-[#C3D7AE] font-semibold block">
                Floating Statement Quote
              </label>
              <textarea
                rows={2}
                value={formData.floatingQuote}
                onChange={(e) => handleTextChange('floatingQuote', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
              />
            </div>

            {/* 4. WhatsApp Links */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Community Link</span>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Community Group URL</label>
                <input
                  type="text"
                  value={formData.whatsappGroupLink}
                  onChange={(e) => handleTextChange('whatsappGroupLink', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#AA78EF]"
                />
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="p-6 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7D4AC7] to-[#AA78EF] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-purple-950/40 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-xl glass-panel text-slate-400 hover:text-white"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
