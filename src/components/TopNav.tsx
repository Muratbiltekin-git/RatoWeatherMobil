import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, ScreenView } from '../types/weather';

interface TopNavProps {
  activeScreen: ScreenView;
  onSelectScreen: (screen: ScreenView) => void;
  onOpenSearch: () => void;
  lang: Language;
}

export function TopNav({ activeScreen, onSelectScreen, onOpenSearch, lang }: TopNavProps) {
  const t = TRANSLATIONS[lang].nav;
  const navItems: Array<{ id: ScreenView; label: string }> = [
    { id: 'forecast', label: t.forecast },
    { id: 'radar', label: t.radar },
    { id: 'atmosphere', label: t.atmosphere },
    { id: 'locations', label: t.locations },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/10 bg-white/70 backdrop-blur-xl transition-colors duration-200 dark:border-white/[0.08] dark:bg-[#050a1b]/72">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:h-16 lg:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectScreen('forecast')}
          className="text-left text-base font-semibold tracking-tight text-slate-900 transition-transform duration-150 hover:opacity-80 active:scale-[0.98] whitespace-nowrap shrink-0 dark:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077b6] dark:focus-visible:outline-[#4cd6fb]"
        >
          Rato Weather
        </button>

        {/* Zone 2: Clean Typography Nav Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectScreen(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077b6] dark:focus-visible:outline-[#4cd6fb] ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#bcc9ce] dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="topnav-active-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[19px] h-[2px] rounded-full bg-gradient-to-r from-[#0284c7] to-[#06b6d4] dark:from-[#38bdf8] dark:to-[#06b6d4] dark:shadow-[0_0_10px_#38bdf8]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-slate-900/12 bg-slate-900/[0.05] px-4 py-2 text-xs font-semibold text-slate-800 transition-all duration-150 hover:-translate-y-[1px] hover:border-[#0284c7]/45 hover:bg-slate-900/[0.09] active:scale-[0.98] whitespace-nowrap shrink-0 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:hover:border-[#4cd6fb]/50 dark:hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077b6] dark:focus-visible:outline-[#4cd6fb]"
          >
            <Search className="h-3.5 w-3.5 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
            <span>{t.searchCity}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
