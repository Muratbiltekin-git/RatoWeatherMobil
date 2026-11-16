import { ArrowRight, Globe, Moon, Plus, SlidersHorizontal, Sun, Thermometer, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../i18n/translations';
import type { CityLocation, CitySummary, Language, TemperatureUnit, ThemeMode } from '../types/weather';
import { formatTemp, formatWind } from '../services/weatherApi';
import { WeatherArtwork } from './WeatherArtwork';

interface LocationsScreenProps {
  summaries: CitySummary[];
  activeCityId: string;
  unit: TemperatureUnit;
  onChangeUnit: (unit: TemperatureUnit) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isLoading: boolean;
  onSelectCity: (city: CityLocation) => void;
  onRemoveCity: (cityId: string) => void;
  onOpenSearch: () => void;
}

export function LocationsScreen({
  summaries,
  activeCityId,
  unit,
  onChangeUnit,
  lang,
  onChangeLang,
  theme,
  onToggleTheme,
  isLoading,
  onSelectCity,
  onRemoveCity,
  onOpenSearch,
}: LocationsScreenProps) {
  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white text-balance">
            {t.locations.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#bcc9ce]">{t.locations.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-[#0284c7] to-[#0077b6] px-5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(2,132,199,0.32)] transition-all duration-150 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] whitespace-nowrap dark:from-[#00b4d8] dark:to-[#0077b6]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{t.locations.addCity}</span>
        </button>
      </div>

      {/* Application Settings Panel (Language, Theme, Units) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        aria-label={t.locations.settingsTitle}
        className="glass-l2 rounded-3xl p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2 border-b border-slate-900/10 pb-3 dark:border-white/10">
          <SlidersHorizontal className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-[#94a3b8]">
            {t.locations.settingsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 divide-y divide-slate-900/10 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-white/10">
          {/* 1. Language Setting */}
          <div className="flex flex-col justify-between gap-3 pt-1 md:pr-5 md:pt-0">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Globe className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
                <span>{t.locations.languageSettingLabel}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">
                {t.locations.languageSettingDesc}
              </p>
            </div>

            <div
              role="group"
              aria-label={t.common.languageLabel}
              className="inline-grid w-full grid-cols-2 rounded-2xl border border-slate-900/12 bg-slate-900/[0.04] p-1 dark:border-white/12 dark:bg-[#050a1b]/60"
            >
              {(
                [
                  { code: 'tr', label: 'Türkçe (TR)' },
                  { code: 'en', label: 'English (EN)' },
                ] as const
              ).map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => onChangeLang(opt.code)}
                    className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-[#0284c7]/25 dark:text-white dark:border dark:border-[#4cd6fb]/45'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#94a3b8] dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Theme Appearance Setting */}
          <div className="flex flex-col justify-between gap-3 pt-5 md:px-5 md:pt-0">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                {isLight ? (
                  <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" />
                )}
                <span>{t.locations.themeSettingLabel}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">
                {t.locations.themeSettingDesc}
              </p>
            </div>

            <div
              role="group"
              aria-label={t.theme.label}
              className="inline-grid w-full grid-cols-2 rounded-2xl border border-slate-900/12 bg-slate-900/[0.04] p-1 dark:border-white/12 dark:bg-[#050a1b]/60"
            >
              <button
                type="button"
                onClick={() => {
                  if (!isLight) onToggleTheme();
                }}
                className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  isLight
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>{t.theme.light}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLight) onToggleTheme();
                }}
                className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  !isLight
                    ? 'border border-[#4cd6fb]/45 bg-[#0284c7]/25 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-[#a78bfa]" aria-hidden="true" />
                <span>{t.theme.dark}</span>
              </button>
            </div>
          </div>

          {/* 3. Unit Setting */}
          <div className="flex flex-col justify-between gap-3 pt-5 md:pl-5 md:pt-0">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Thermometer className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
                <span>{t.locations.unitSettingLabel}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">
                {t.locations.unitSettingDesc}
              </p>
            </div>

            <div
              role="group"
              aria-label={t.common.unitLabel}
              className="inline-grid w-full grid-cols-2 rounded-2xl border border-slate-900/12 bg-slate-900/[0.04] p-1 dark:border-white/12 dark:bg-[#050a1b]/60"
            >
              {(
                [
                  { code: 'C', label: '°C · km/h' },
                  { code: 'F', label: '°F · mph' },
                ] as const
              ).map((opt) => {
                const active = unit === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => onChangeUnit(opt.code)}
                    className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-[#0284c7]/25 dark:text-white dark:border dark:border-[#4cd6fb]/45'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#94a3b8] dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Saved Cities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-[#94a3b8]">
            {t.locations.savedCitiesTitle}
          </h2>
          <span className="text-xs text-slate-500 dark:text-[#869398] tabular-nums">
            {summaries.length}
          </span>
        </div>

        {isLoading && summaries.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="glass-l1 h-48 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((item, idx) => {
              const isActive = item.location.id === activeCityId;
              const wind = formatWind(item.windSpeedKmh, unit, lang);

              return (
                <motion.article
                  key={item.location.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: Math.min(idx * 0.04, 0.24),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 ${
                    isActive
                      ? 'glass-l2 border-[#0284c7]/45 dark:border-[#4cd6fb]/50'
                      : 'glass-l1 hover:border-slate-900/20 dark:hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {item.location.name}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0284c7] dark:text-[#4cd6fb]">
                            {t.common.active}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94a3b8] tabular-nums">
                        {item.location.country} · {item.localTimeLabel}
                      </p>
                    </div>
                    <WeatherArtwork kind={item.conditionKind} size={46} />
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-5xl font-extralight leading-none tracking-[-0.03em] text-slate-900 dark:text-white tabular-nums">
                        {formatTemp(item.temperatureC, unit)}°
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-700 dark:text-[#dbe1ff]">
                        {item.conditionLabel}
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-600 dark:text-[#bcc9ce] tabular-nums space-y-1">
                      <div>
                        {t.common.highShort}: {formatTemp(item.highC, unit)}° · {t.common.lowShort}:{' '}
                        {formatTemp(item.lowC, unit)}°
                      </div>
                      <div>
                        {lang === 'tr' ? `%${item.humidity} ${t.common.humidity}` : `${item.humidity}% RH`} · {wind.value}{' '}
                        {wind.label}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-900/10 pt-3 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => onSelectCity(item.location)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-[#0284c7] transition-colors hover:text-slate-900 dark:text-[#4cd6fb] dark:hover:text-white"
                    >
                      <span>{t.locations.viewForecast}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>

                    {summaries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveCity(item.location.id)}
                        aria-label={t.locations.removeCity(item.location.name)}
                        className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-900/10 hover:text-red-600 dark:text-[#869398] dark:hover:bg-white/10 dark:hover:text-[#ffb4ab]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
