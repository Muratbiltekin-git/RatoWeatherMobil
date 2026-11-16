import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Minus,
  RefreshCw,
  ShieldAlert,
  Sun,
  Wind,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type {
  CityLocation,
  Language,
  ScreenView,
  TemperatureUnit,
  ThemeMode,
  WeatherBundle,
} from '../types/weather';
import {
  degreesToCardinal,
  formatIsoClock,
  formatLocalTime,
  formatTemp,
  formatVisibility,
  formatWind,
  getUvGuidance,
} from '../services/weatherApi';
import { WeatherArtwork } from './WeatherArtwork';
import { deriveWeatherAlerts, WeatherAlertBanner } from './WeatherAlertBanner';
import { SolarCycleWidget } from './SolarCycleWidget';

interface ForecastScreenProps {
  bundle: WeatherBundle;
  unit: TemperatureUnit;
  lang: Language;
  theme: ThemeMode;
  savedCities: CityLocation[];
  onSelectCity: (city: CityLocation) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onNavigate: (screen: ScreenView) => void;
}

export function ForecastScreen({
  bundle,
  unit,
  lang,
  theme,
  savedCities,
  onSelectCity,
  onRefresh,
  isRefreshing,
  onNavigate,
}: ForecastScreenProps) {
  const [selectedHourIdx, setSelectedHourIdx] = useState(0);
  const [expandedDayIso, setExpandedDayIso] = useState<string | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [forceAlertPreview, setForceAlertPreview] = useState(false);

  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang];
  const { location, current, hourly, daily, airQuality } = bundle;
  const liveAlerts = useMemo(() => deriveWeatherAlerts(bundle, unit, lang), [bundle, unit, lang]);
  const hasVisibleBanner = forceAlertPreview || (isAlertVisible && liveAlerts.length > 0);
  const activeHour = hourly[selectedHourIdx] ?? hourly[0];
  const windInfo = formatWind(current.windSpeedKmh, unit, lang);
  const gustInfo = formatWind(current.windGustsKmh, unit, lang);
  const visInfo = formatVisibility(current.visibilityKm, unit);
  const uvMeta = getUvGuidance(current.uvIndex, lang);

  const globalMinC = Math.min(...daily.map((d) => d.tempMinC));
  const globalMaxC = Math.max(...daily.map((d) => d.tempMaxC));
  const tempSpan = Math.max(1, globalMaxC - globalMinC);

  const advisory = (() => {
    const peakPrecip = Math.max(...hourly.slice(0, 6).map((h) => h.precipProbability));
    if (current.uvIndex >= 6) {
      return {
        tone: 'amber' as const,
        title: t.forecast.advisoryHighUv(current.uvIndex.toFixed(1)),
        detail: uvMeta.advice,
      };
    }
    if (peakPrecip >= 55) {
      return {
        tone: 'cyan' as const,
        title: t.forecast.advisoryPrecip(peakPrecip),
        detail: t.forecast.advisoryPrecipDetail,
      };
    }
    if (airQuality.usAqi > 75) {
      return {
        tone: 'violet' as const,
        title: t.forecast.advisoryAqi(airQuality.usAqi),
        detail: airQuality.advisoryText,
      };
    }
    return null;
  })();

  const hourlySlice = hourly.slice(0, 16);
  const sparkTemps = hourlySlice.map((h) => h.temperatureC);
  const sparkMin = Math.min(...sparkTemps);
  const sparkMax = Math.max(...sparkTemps);
  const sparkRange = Math.max(1, sparkMax - sparkMin);

  const activeHourWind = formatWind(activeHour.windSpeedKmh, unit, lang);

  return (
    <div>
      <WeatherAlertBanner
        bundle={bundle}
        unit={unit}
        lang={lang}
        isVisible={isAlertVisible}
        forcePreview={forceAlertPreview}
        onDismiss={() => {
          setIsAlertVisible(false);
          setForceAlertPreview(false);
        }}
        onViewRadar={() => onNavigate('radar')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT ANCHOR PANEL */}
        <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-24">
          <section className="glass-l2 rounded-3xl p-6">
            {/* City & Local Time + Refresh */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-slate-900 dark:text-white sm:text-[34px] text-balance">
                  {location.name}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-slate-600 dark:text-[#bcc9ce]">
                  <span>{[location.region, location.country].filter(Boolean).join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-[#0284c7] dark:text-[#4cd6fb]">
                    {formatLocalTime(location.timezone, lang)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label={t.common.refresh}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-slate-900/12 bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-60 dark:border-white/12 dark:bg-white/[0.06] dark:text-[#bcc9ce] dark:hover:bg-white/[0.12] dark:hover:text-white"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#0284c7] dark:text-[#4cd6fb] ${isRefreshing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{isRefreshing ? t.common.updating : t.common.refresh}</span>
              </button>
            </div>

            {/* Display Hero Temperature + Bespoke Artwork */}
            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="flex items-start">
                <span className="text-[72px] font-extralight leading-none tracking-[-0.04em] text-slate-900 dark:text-white tabular-nums sm:text-[88px] lg:text-[96px]">
                  {formatTemp(current.temperatureC, unit)}
                </span>
                <span className="mt-2 text-2xl font-light text-slate-600 dark:text-[#bcc9ce]">°{unit}</span>
              </div>
              <WeatherArtwork kind={current.conditionKind} size={88} />
            </div>

            {/* Condition & High/Low Metadata */}
            <div className="mt-5 border-t border-slate-900/10 pt-4 dark:border-white/10">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">{current.conditionLabel}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                <span>
                  {t.common.feelsLike} {formatTemp(current.feelsLikeC, unit)}°
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.common.highShort}: {formatTemp(current.highC, unit)}°
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.common.lowShort}: {formatTemp(current.lowC, unit)}°
                </span>
              </div>
            </div>

            {/* Contextual Advisory */}
            {advisory && (
              <div className="mt-5 rounded-2xl border border-slate-900/10 bg-slate-900/[0.04] px-4 py-3 dark:border-white/12 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      advisory.tone === 'amber'
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)] dark:bg-[#ffb784] dark:shadow-[0_0_8px_#f47d00]'
                        : advisory.tone === 'cyan'
                          ? 'bg-sky-500 shadow-[0_0_8px_rgba(2,132,199,0.7)] dark:bg-[#4cd6fb] dark:shadow-[0_0_8px_#00b4d8]'
                          : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] dark:bg-[#e0b6ff] dark:shadow-[0_0_8px_#ca89ff]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{advisory.title}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">{advisory.detail}</p>
              </div>
            )}

            {/* Quick Radar Jump CTA + Storm Alert Preview Trigger */}
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => onNavigate('radar')}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,180,216,0.35)] transition-transform duration-150 hover:brightness-110 active:scale-[0.98]"
              >
                <span>{t.forecast.openRadarCta}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              {!hasVisibleBanner && (
                <button
                  type="button"
                  onClick={() => {
                    setForceAlertPreview(true);
                    setIsAlertVisible(true);
                  }}
                  className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full border border-red-600/35 bg-red-600/10 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-600/20 hover:text-red-900 dark:border-[#ffb4ab]/35 dark:bg-[#93000a]/35 dark:text-[#ffdad6] dark:hover:bg-[#93000a]/60 dark:hover:text-white"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-red-600 dark:text-[#ffb4ab]" aria-hidden="true" />
                  <span>{t.alerts.testAlert}</span>
                </button>
              )}
            </div>
          </section>

        </aside>

        {/* RIGHT ANALYTICAL MATRIX */}
        <div className="space-y-6 lg:col-span-8">
          {/* 1. HOURLY HORIZONTAL RIBBON */}
          <section className="glass-l1 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.forecast.hourlyTrajectory}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white tabular-nums">
                  {activeHour.hourLabel === t.common.now ? t.forecast.currentHour : activeHour.hourLabel}
                  <span className="mx-2 text-slate-400 dark:text-[#869398]">·</span>
                  <span>{activeHour.conditionLabel}</span>
                  <span className="mx-2 text-slate-400 dark:text-[#869398]">·</span>
                  <span className="text-[#0284c7] dark:text-[#4cd6fb]">
                    {lang === 'tr'
                      ? `%${activeHour.precipProbability} ${t.common.precip}`
                      : `${activeHour.precipProbability}% ${t.common.precip}`}
                  </span>
                  <span className="mx-2 text-slate-400 dark:text-[#869398]">·</span>
                  <span>
                    {t.common.wind} {activeHourWind.value} {activeHourWind.label}
                  </span>
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-[#869398] tabular-nums">
                UV {activeHour.uvIndex.toFixed(1)} ·{' '}
                {lang === 'tr' ? `%${activeHour.humidity} ${t.common.humidity}` : `${activeHour.humidity}% RH`}
              </span>
            </div>

            <div className="mt-4 h-14 w-full overflow-hidden">
              <svg viewBox="0 0 640 56" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="hourly-line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={isLight ? '#0284c7' : '#4cd6fb'} />
                    <stop offset="55%" stopColor={isLight ? '#ea580c' : '#ffb784'} />
                    <stop offset="100%" stopColor={isLight ? '#9333ea' : '#e0b6ff'} />
                  </linearGradient>
                  <linearGradient id="hourly-fill-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isLight ? '#0284c7' : '#4cd6fb'} stopOpacity={isLight ? '0.2' : '0.22'} />
                    <stop offset="100%" stopColor={isLight ? '#0284c7' : '#4cd6fb'} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const pts = hourlySlice.map((h, i) => {
                    const x = (i / Math.max(1, hourlySlice.length - 1)) * 624 + 8;
                    const y = 44 - ((h.temperatureC - sparkMin) / sparkRange) * 32;
                    return { x, y };
                  });
                  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
                  const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)} 56 L ${pts[0].x.toFixed(1)} 56 Z`;
                  const activePt = pts[Math.min(selectedHourIdx, pts.length - 1)];
                  return (
                    <>
                      <path d={areaD} fill="url(#hourly-fill-grad)" />
                      <path d={lineD} fill="none" stroke="url(#hourly-line-grad)" strokeWidth="2.5" strokeLinecap="round" />
                      {activePt && (
                        <circle
                          cx={activePt.x}
                          cy={activePt.y}
                          r="4.5"
                          fill="#ffffff"
                          stroke={isLight ? '#0284c7' : '#4cd6fb'}
                          strokeWidth="2.5"
                        />
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="aura-scroll -mx-2 mt-2 flex gap-2 overflow-x-auto px-2 pb-2">
              {hourly.map((item, idx) => {
                const isActive = idx === selectedHourIdx;
                return (
                  <button
                    key={item.timeIso}
                    type="button"
                    onClick={() => setSelectedHourIdx(idx)}
                    className={`flex min-h-[112px] min-w-[68px] shrink-0 flex-col items-center justify-between rounded-2xl px-2.5 py-3 transition-all duration-150 ${
                      isActive
                        ? 'border border-slate-900/15 bg-slate-900/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] dark:border-white/25 dark:bg-white/14 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
                        : 'border border-transparent hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#bcc9ce]'
                      }`}
                    >
                      {item.hourLabel}
                    </span>
                    <WeatherArtwork kind={item.conditionKind} size={28} />
                    <span className="h-3.5 text-[11px] font-semibold text-[#0284c7] dark:text-[#4cd6fb] tabular-nums">
                      {item.precipProbability >= 15
                        ? lang === 'tr'
                          ? `%${item.precipProbability}`
                          : `${item.precipProbability}%`
                        : ''}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatTemp(item.temperatureC, unit)}°
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. 10-DAY EXTENDED FORECAST */}
          <section className="glass-l1 rounded-3xl p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                {t.forecast.tenDayForecast}
              </h2>
              <span className="text-xs text-slate-500 dark:text-[#869398]">{t.forecast.selectDayDetails}</span>
            </div>

            <div className="divide-y divide-slate-900/[0.08] dark:divide-white/[0.08]">
              {daily.map((day) => {
                const leftPct = ((day.tempMinC - globalMinC) / tempSpan) * 100;
                const widthPct = Math.max(8, ((day.tempMaxC - day.tempMinC) / tempSpan) * 100);
                const isExpanded = expandedDayIso === day.dateIso;
                const dayWind = formatWind(day.windSpeedMaxKmh, unit, lang);

                return (
                  <div key={day.dateIso} className="py-1">
                    <button
                      type="button"
                      onClick={() => setExpandedDayIso(isExpanded ? null : day.dateIso)}
                      aria-expanded={isExpanded}
                      className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.05]"
                    >
                      <div className="w-20 shrink-0 sm:w-24">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{day.dayName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-[#869398]">{day.shortDate}</div>
                      </div>

                      <div className="flex w-16 shrink-0 items-center gap-1.5">
                        <WeatherArtwork kind={day.conditionKind} size={26} />
                        <span className="text-[11px] font-semibold text-[#0284c7] dark:text-[#4cd6fb] tabular-nums">
                          {day.precipProbabilityMax >= 15
                            ? lang === 'tr'
                              ? `%${day.precipProbabilityMax}`
                              : `${day.precipProbabilityMax}%`
                            : ''}
                        </span>
                      </div>

                      <div className="flex flex-1 items-center gap-3">
                        <span className="w-9 text-right text-sm text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                          {formatTemp(day.tempMinC, unit)}°
                        </span>
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                          <div
                            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#0284c7] via-[#f59e0b] to-[#ea580c] dark:from-[#4cd6fb] dark:via-[#ffb784] dark:to-[#f47d00]"
                            style={{
                              left: `${leftPct}%`,
                              width: `${Math.min(100 - leftPct, widthPct)}%`,
                            }}
                          />
                        </div>
                        <span className="w-9 text-right text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                          {formatTemp(day.tempMaxC, unit)}°
                        </span>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 dark:text-[#869398] ${
                          isExpanded ? 'rotate-180 text-[#0284c7] dark:text-[#4cd6fb]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                          className="mb-2 mt-1 grid grid-cols-2 gap-3 rounded-2xl bg-slate-900/[0.04] px-4 py-3 text-xs text-slate-600 dark:bg-white/[0.04] dark:text-[#bcc9ce] sm:grid-cols-4 tabular-nums"
                        >
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
                              {t.common.condition}
                            </div>
                            <div className="mt-0.5 font-medium text-slate-900 dark:text-white">{day.conditionLabel}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
                              {t.common.peakWind}
                            </div>
                            <div className="mt-0.5 font-medium text-slate-900 dark:text-white">
                              {dayWind.value} {dayWind.label}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
                              {t.common.uvPeak}
                            </div>
                            <div className="mt-0.5 font-medium text-amber-600 dark:text-[#ffb784]">
                              {day.uvIndexMax.toFixed(1)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
                              {t.common.sunriseSunset}
                            </div>
                            <div className="mt-0.5 font-medium text-slate-900 dark:text-white">
                              {formatIsoClock(day.sunriseIso, lang)} / {formatIsoClock(day.sunsetIso, lang)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. TELEMETRY SUB-METRIC GLASS PODS */}
          <section
            aria-label={lang === 'tr' ? 'Atmosferik telemetri ölçümleri' : 'Atmospheric telemetry metrics'}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {/* UV Index Pod */}
            <div className="glass-l1 flex flex-col justify-between rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.common.uvIndex}
                </span>
                <Sun className="h-4 w-4 text-amber-500 dark:text-[#ffb784]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {current.uvIndex.toFixed(1)}
                </span>
                <span className="text-sm font-medium text-amber-600 dark:text-[#ffb784]">{uvMeta.level}</span>
              </div>
              <div className="mt-4">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#f59e0b] to-[#ea580c] dark:from-[#4cd6fb] dark:via-[#ffb784] dark:to-[#f47d00]"
                    style={{ width: `${Math.min(100, Math.max(6, (current.uvIndex / 11) * 100))}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">{uvMeta.advice}</p>
              </div>
            </div>

            {/* Wind Vector Pod */}
            <div className="glass-l1 flex flex-col justify-between rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.forecast.windVector}
                </span>
                <Wind className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                      {windInfo.value}
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-[#bcc9ce]">{windInfo.label}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-[#94a3b8] tabular-nums">
                    {degreesToCardinal(current.windDirectionDeg, lang)} ({Math.round(current.windDirectionDeg)}°) ·{' '}
                    {t.forecast.gusts} {gustInfo.value} {gustInfo.label}
                  </div>
                </div>
                <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden="true">
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    stroke={isLight ? 'rgba(15,23,42,0.16)' : 'rgba(255,255,255,0.14)'}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <text x="32" y="12" textAnchor="middle" fill={isLight ? '#475569' : '#869398'} fontSize="8" fontWeight="600">
                    {lang === 'tr' ? 'K' : 'N'}
                  </text>
                  <text x="54" y="35" textAnchor="middle" fill={isLight ? '#475569' : '#869398'} fontSize="8" fontWeight="600">
                    {lang === 'tr' ? 'D' : 'E'}
                  </text>
                  <text x="32" y="57" textAnchor="middle" fill={isLight ? '#475569' : '#869398'} fontSize="8" fontWeight="600">
                    {lang === 'tr' ? 'G' : 'S'}
                  </text>
                  <text x="10" y="35" textAnchor="middle" fill={isLight ? '#475569' : '#869398'} fontSize="8" fontWeight="600">
                    {lang === 'tr' ? 'B' : 'W'}
                  </text>
                  <g transform={`rotate(${current.windDirectionDeg} 32 32)`}>
                    <line
                      x1="32"
                      y1="45"
                      x2="32"
                      y2="17"
                      stroke={isLight ? '#0284c7' : '#4cd6fb'}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <polygon points="32,12 27,22 37,22" fill={isLight ? '#0284c7' : '#4cd6fb'} />
                  </g>
                </svg>
              </div>
            </div>

            {/* Humidity & Dew Point Pod */}
            <div className="glass-l1 flex flex-col justify-between rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.common.humidity}
                </span>
                <Droplets className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {lang === 'tr' ? `%${current.humidity}` : `${current.humidity}%`}
                </span>
                <span className="text-xs text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                  {t.common.dewPoint} {formatTemp(current.dewPointC, unit)}°
                </span>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] shadow-[0_0_10px_rgba(2,132,199,0.35)] dark:from-[#00b4d8] dark:to-[#4cd6fb] dark:shadow-[0_0_12px_#4cd6fb]"
                    style={{ width: `${Math.min(100, Math.max(4, current.humidity))}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-[#bcc9ce]">
                  {current.humidity < 40
                    ? t.forecast.humidityDry
                    : current.humidity <= 70
                      ? t.forecast.humidityBalanced
                      : t.forecast.humidityHigh}
                </p>
              </div>
            </div>

            {/* Air Quality Index Pod */}
            <button
              type="button"
              onClick={() => onNavigate('atmosphere')}
              className="glass-l1 flex flex-col justify-between rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 dark:hover:border-[#e0b6ff]/40"
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.forecast.airQualityTitle}
                </span>
                <ArrowUpRight className="h-4 w-4 text-purple-600 dark:text-[#e0b6ff]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {airQuality.usAqi}
                </span>
                <span className="text-sm font-medium text-purple-700 dark:text-[#e0b6ff]">
                  {airQuality.ratingLabel}
                </span>
              </div>
              <div className="mt-4 w-full">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#9333ea] to-[#ea580c] dark:from-[#4cd6fb] dark:via-[#ca89ff] dark:to-[#ffb784]"
                    style={{ width: `${Math.min(100, Math.max(8, (airQuality.usAqi / 150) * 100))}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                  PM2.5: {airQuality.pm25} µg/m³ · {t.forecast.tapFullSpectrum}
                </p>
              </div>
            </button>

            {/* Cloud Cover & Precipitation Pod */}
            <div className="glass-l1 flex flex-col justify-between rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {lang === 'tr' ? 'Bulut Örtüsü' : 'Cloud Cover'}
                </span>
                <Cloud className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {lang === 'tr' ? `%${current.cloudCover}` : `${current.cloudCover}%`}
                </span>
                <span className="text-xs text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                  {current.precipitationMm.toFixed(1)} mm
                </span>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-slate-400 dark:from-[#4cd6fb] dark:to-[#dbe1ff]"
                    style={{ width: `${Math.min(100, Math.max(6, current.cloudCover))}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-[#bcc9ce]">
                  {current.cloudCover < 25
                    ? lang === 'tr'
                      ? 'Açık gökyüzü ve yüksek görüş.'
                      : 'Mostly clear sky canopy.'
                    : current.cloudCover <= 70
                      ? lang === 'tr'
                        ? 'Parçalı bulut katmanı aktif.'
                        : 'Scattered cloud layer present.'
                      : lang === 'tr'
                        ? 'Yoğun bulut örtüsü hakim.'
                        : 'Dense overcast canopy overhead.'}
                </p>
              </div>
            </div>

            {/* Barometric Pressure & Visibility Pod */}
            <div className="glass-l1 flex flex-col justify-between rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
                  {t.forecast.pressureVisibility}
                </span>
                <Gauge className="h-4 w-4 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {current.pressureHpa}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-[#bcc9ce]">hPa</span>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#0284c7] dark:text-[#4cd6fb]">
                  {current.pressureTrend === 'rising' ? (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : current.pressureTrend === 'falling' ? (
                    <ArrowDownRight className="h-3.5 w-3.5 text-amber-600 dark:text-[#ffb784]" aria-hidden="true" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{t.forecast.pressureTrend[current.pressureTrend]}</span>
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-900/10 pt-3 text-xs text-slate-600 dark:border-white/10 dark:text-[#bcc9ce] tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-[#869398]" aria-hidden="true" />
                  {t.common.visibility}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {visInfo.value} {visInfo.label}
                </span>
              </div>
            </div>
          </section>

          {/* 4. SOLAR CYCLE D3 DYNAMIC ARC WIDGET */}
          <SolarCycleWidget
            sunriseIso={current.sunriseIso}
            sunsetIso={current.sunsetIso}
            timezone={location.timezone}
            lang={lang}
            theme={theme}
          />
        </div>
      </div>

      {/* Pinned Cities Quick Switcher at Bottom of Page */}
      <section className="glass-l1 mt-6 rounded-3xl p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
            {t.forecast.pinnedLocations}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('locations')}
            className="text-xs font-medium text-[#0284c7] hover:underline dark:text-[#4cd6fb]"
          >
            {t.common.manageAll}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {savedCities.map((city) => {
            const active = city.id === location.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                  active
                    ? 'border-[#0284c7]/50 bg-[#0284c7]/15 text-slate-900 shadow-[0_0_12px_rgba(2,132,199,0.16)] dark:border-[#4cd6fb]/60 dark:bg-[#4cd6fb]/15 dark:text-white dark:shadow-[0_0_12px_rgba(76,214,251,0.2)]'
                    : 'border-slate-900/10 bg-slate-900/[0.04] text-slate-700 hover:border-slate-900/25 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-[#bcc9ce] dark:hover:border-white/25 dark:hover:text-white'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
