import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronRight, Radar, ShieldAlert, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, TemperatureUnit, WeatherBundle } from '../types/weather';
import { formatTemp, formatWind } from '../services/weatherApi';

export interface DerivedAlert {
  id: string;
  title: string;
  summary: string;
  guidance: string;
  metricBadge: string;
  isPreview: boolean;
}

export function deriveWeatherAlerts(
  bundle: WeatherBundle,
  unit: TemperatureUnit,
  lang: Language
): DerivedAlert[] {
  const t = TRANSLATIONS[lang].alerts;
  const { location, current, hourly, daily, airQuality } = bundle;
  const alerts: DerivedAlert[] = [];

  // 1. Thunderstorm / Squall (WMO >= 95)
  const stormHour = hourly.slice(0, 18).find((h) => h.weatherCode >= 95);
  if (current.conditionKind === 'storm' || stormHour) {
    const gust = formatWind(current.windGustsKmh, unit, lang);
    alerts.push({
      id: `severe-storm-${location.id}`,
      title: t.stormTitle,
      summary: t.stormSummary(location.name),
      guidance: t.stormGuidance,
      metricBadge: stormHour
        ? `${stormHour.hourLabel} · ${gust.value} ${gust.label}`
        : `${gust.value} ${gust.label}`,
      isPreview: false,
    });
  }

  // 2. Extreme Wind Gusts (>= 68 km/h gusts or sustained >= 50 km/h)
  const peakGustKmh = Math.max(
    current.windGustsKmh,
    ...hourly.slice(0, 12).map((h) => h.windSpeedKmh * 1.35)
  );
  if (peakGustKmh >= 68) {
    const gustInfo = formatWind(peakGustKmh, unit, lang);
    alerts.push({
      id: `high-wind-${location.id}`,
      title: t.windTitle,
      summary: t.windSummary(location.name, `${gustInfo.value} ${gustInfo.label}`),
      guidance: t.windGuidance,
      metricBadge: `${gustInfo.value} ${gustInfo.label}`,
      isPreview: false,
    });
  }

  // 3. Heavy Rainfall / Flash Flood Watch
  const heavyRainToday =
    current.weatherCode === 65 ||
    current.weatherCode === 82 ||
    (daily[0]?.precipitationSumMm ?? 0) >= 25 ||
    hourly.slice(0, 12).some((h) => h.precipitationMm >= 8);
  if (heavyRainToday) {
    const mmTotal = Math.max(
      daily[0]?.precipitationSumMm ?? 0,
      hourly.slice(0, 12).reduce((acc, h) => acc + h.precipitationMm, 0)
    );
    alerts.push({
      id: `heavy-rain-${location.id}`,
      title: t.rainTitle,
      summary: t.rainSummary(location.name, `${mmTotal.toFixed(1)} mm`),
      guidance: t.rainGuidance,
      metricBadge: `${mmTotal.toFixed(1)} mm`,
      isPreview: false,
    });
  }

  // 4. Extreme High Temperature (>= 37°C current or >= 39°C daily max)
  if (current.temperatureC >= 37 || (daily[0]?.tempMaxC ?? 20) >= 39) {
    const maxVal = Math.max(current.temperatureC, daily[0]?.tempMaxC ?? current.temperatureC);
    alerts.push({
      id: `extreme-heat-${location.id}`,
      title: t.heatTitle,
      summary: t.heatSummary(location.name, `${formatTemp(maxVal, unit)}°${unit}`),
      guidance: t.heatGuidance,
      metricBadge: `${formatTemp(maxVal, unit)}°${unit}`,
      isPreview: false,
    });
  }

  // 5. Sub-Zero Freeze Warning (<= 0°C current or <= -2°C daily min)
  if (current.temperatureC <= 0 || (daily[0]?.tempMinC ?? 10) <= -2) {
    const minVal = Math.min(current.temperatureC, daily[0]?.tempMinC ?? current.temperatureC);
    alerts.push({
      id: `freeze-warning-${location.id}`,
      title: t.freezeTitle,
      summary: t.freezeSummary(location.name, `${formatTemp(minVal, unit)}°${unit}`),
      guidance: t.freezeGuidance,
      metricBadge: `${formatTemp(minVal, unit)}°${unit}`,
      isPreview: false,
    });
  }

  // 6. Extreme Solar UV (>= 9 current or >= 10 daily peak)
  if (current.uvIndex >= 9 || (daily[0]?.uvIndexMax ?? 0) >= 10) {
    const peakUv = Math.max(current.uvIndex, daily[0]?.uvIndexMax ?? 0);
    alerts.push({
      id: `extreme-uv-${location.id}`,
      title: t.uvTitle,
      summary: t.uvSummary(location.name, peakUv.toFixed(1)),
      guidance: t.uvGuidance,
      metricBadge: `UV ${peakUv.toFixed(1)}`,
      isPreview: false,
    });
  }

  // 7. Unhealthy Air Quality (US AQI >= 151)
  if (airQuality.usAqi >= 151) {
    alerts.push({
      id: `aqi-alert-${location.id}`,
      title: t.aqiTitle,
      summary: t.aqiSummary(location.name, airQuality.usAqi),
      guidance: t.aqiGuidance,
      metricBadge: `AQI ${airQuality.usAqi}`,
      isPreview: false,
    });
  }

  return alerts;
}

interface WeatherAlertBannerProps {
  bundle: WeatherBundle;
  unit: TemperatureUnit;
  lang: Language;
  isVisible: boolean;
  forcePreview: boolean;
  onDismiss: () => void;
  onViewRadar: () => void;
}

export function WeatherAlertBanner({
  bundle,
  unit,
  lang,
  isVisible,
  forcePreview,
  onDismiss,
  onViewRadar,
}: WeatherAlertBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);
  const t = TRANSLATIONS[lang].alerts;

  const liveAlerts = useMemo(() => deriveWeatherAlerts(bundle, unit, lang), [bundle, unit, lang]);

  const activeAlert: DerivedAlert | null = useMemo(() => {
    if (forcePreview) {
      const gust = formatWind(Math.max(74, bundle.current.windGustsKmh), unit, lang);
      return {
        id: `preview-severe-storm-${bundle.location.id}`,
        title: t.stormTitle,
        summary: t.stormSummary(bundle.location.name),
        guidance: t.stormGuidance,
        metricBadge: `${gust.value} ${gust.label}`,
        isPreview: true,
      };
    }
    if (liveAlerts.length > 0) {
      return liveAlerts[alertIndex % liveAlerts.length];
    }
    return null;
  }, [liveAlerts, alertIndex, forcePreview, bundle, unit, lang, t]);

  return (
    <AnimatePresence>
      {isVisible && activeAlert && (
        <motion.section
          key={activeAlert.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          role="alert"
          aria-live="assertive"
          className="mb-6 overflow-hidden rounded-3xl border border-red-400/70 bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] shadow-[0_18px_40px_-10px_rgba(185,28,28,0.45),inset_0_1px_0_0_rgba(254,202,202,0.4)] backdrop-blur-xl dark:border-[#ffb4ab]/55 dark:from-[#93000a]/95 dark:via-[#7b0007]/92 dark:to-[#690005]/95 dark:shadow-[0_18px_42px_-10px_rgba(147,0,10,0.65),inset_0_1px_0_0_rgba(255,218,214,0.3)]"
        >
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200/40 bg-[#7f1d1d]/80 text-red-100 dark:border-[#ffb4ab]/40 dark:bg-[#690005]/80 dark:text-[#ffb4ab]">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-red-100 dark:text-[#ffdad6]">
                  <span>{t.bannerHeading}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-red-200 dark:text-[#ffb4ab]">
                    {activeAlert.isPreview ? t.previewLabel : t.urgentLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-white">{activeAlert.metricBadge}</span>
                </div>

                <h2 className="mt-1 text-base font-semibold leading-snug text-white sm:text-lg">
                  {activeAlert.title}
                </h2>
                <p className="mt-0.5 text-sm leading-relaxed text-red-50 dark:text-[#ffdad6]">
                  {activeAlert.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 sm:pl-4">
              {!forcePreview && liveAlerts.length > 1 && (
                <button
                  type="button"
                  onClick={() => setAlertIndex((prev) => (prev + 1) % liveAlerts.length)}
                  aria-label={lang === 'tr' ? 'Sonraki uyarıyı göster' : 'Show next alert'}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-red-200/45 bg-[#7f1d1d]/75 px-3 py-2 text-xs font-semibold text-red-50 transition-colors hover:bg-[#7f1d1d] hover:text-white tabular-nums whitespace-nowrap dark:border-[#ffb4ab]/45 dark:bg-[#690005]/75 dark:text-[#ffdad6] dark:hover:bg-[#690005]"
                >
                  <span>
                    {(alertIndex % liveAlerts.length) + 1}/{liveAlerts.length}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-red-200/45 bg-[#7f1d1d]/75 px-3.5 py-2 text-xs font-semibold text-red-50 transition-colors hover:bg-[#7f1d1d] hover:text-white whitespace-nowrap dark:border-[#ffb4ab]/45 dark:bg-[#690005]/75 dark:text-[#ffdad6] dark:hover:bg-[#690005]"
              >
                <span>{isExpanded ? t.hideDetails : t.details}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={onViewRadar}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#7f1d1d] shadow-sm transition-transform hover:bg-red-50 active:scale-[0.98] whitespace-nowrap dark:text-[#690005] dark:hover:bg-[#ffdad6]"
              >
                <Radar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.viewRadar}</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                aria-label={t.dismiss}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-red-200/35 bg-[#7f1d1d]/65 text-red-100 transition-colors hover:bg-[#7f1d1d] hover:text-white dark:border-[#ffb4ab]/30 dark:bg-[#690005]/60 dark:text-[#ffdad6] dark:hover:bg-[#690005]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-3 border-t border-red-200/25 bg-[#7f1d1d]/65 px-5 py-3.5 text-xs text-red-50 sm:grid-cols-2 sm:px-6 dark:border-[#ffb4ab]/25 dark:bg-[#690005]/55 dark:text-[#ffdad6]"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-red-200 dark:text-[#ffb4ab]">
                    {t.issuedFor}
                  </div>
                  <div className="mt-1 font-medium text-white tabular-nums">
                    {bundle.location.name} ({bundle.location.latitude.toFixed(2)}°,{' '}
                    {bundle.location.longitude.toFixed(2)}°)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-red-200 dark:text-[#ffb4ab]">
                    {t.safetyGuidance}
                  </div>
                  <div className="mt-1 leading-relaxed text-red-50 dark:text-[#ffdad6]">
                    {activeAlert.guidance}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
