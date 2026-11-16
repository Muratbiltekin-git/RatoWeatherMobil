import { CloudSun, Radar, SlidersHorizontal, Wind } from 'lucide-react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, ScreenView } from '../types/weather';

interface MobileDockProps {
  activeScreen: ScreenView;
  onSelectScreen: (screen: ScreenView) => void;
  lang: Language;
}

export function MobileDock({ activeScreen, onSelectScreen, lang }: MobileDockProps) {
  const t = TRANSLATIONS[lang].nav;
  const dockItems: Array<{ id: ScreenView; label: string; Icon: typeof CloudSun }> = [
    { id: 'forecast', label: t.forecast, Icon: CloudSun },
    { id: 'radar', label: t.radar, Icon: Radar },
    { id: 'atmosphere', label: t.atmosphere, Icon: Wind },
    { id: 'locations', label: t.cities, Icon: SlidersHorizontal },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:hidden">
      <nav
        aria-label="Mobile navigation"
        className="glass-dock pointer-events-auto grid w-full max-w-md grid-cols-4 items-center rounded-2xl px-1.5 py-1"
      >
        {dockItems.map(({ id, label, Icon }) => {
          const active = activeScreen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectScreen(id)}
              className={`relative flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1 text-[10px] font-medium transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0284c7] dark:focus-visible:outline-[#4cd6fb] ${
                active
                  ? 'text-[#0284c7] dark:text-[#4cd6fb]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#bcc9ce] dark:hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobiledock-active-halo"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 bottom-0 h-5 rounded-full bg-[#0284c7]/15 blur-md dark:bg-[#4cd6fb]/20"
                />
              )}
              <Icon className="relative h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="relative max-w-full truncate whitespace-nowrap leading-none">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
