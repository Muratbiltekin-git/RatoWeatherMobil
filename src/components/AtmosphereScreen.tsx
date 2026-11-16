import { Compass, Moon, Sparkles, Sun, Wind } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, TemperatureUnit, ThemeMode, WeatherBundle } from '../types/weather';
import { formatTemp, formatWind, getUvGuidance } from '../services/weatherApi';

interface AtmosphereScreenProps {
  bundle: WeatherBundle;
  unit: TemperatureUnit;
  lang: Language;
  theme: ThemeMode;
}

export function AtmosphereScreen({
  bundle,
  unit,
  lang,
  theme,
}: AtmosphereScreenProps) {
  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang];
  const { location, airQuality, hourly, current } = bundle;
  const uvMax = Math.max(...hourly.map((h) => h.uvIndex), current.uvIndex, 1);
  const uvGuidance = getUvGuidance(current.uvIndex, lang);

  const pollutants = [
    { label: t.atmosphere.pollutants.pm25, value: airQuality.pm25, unit: 'µg/m³', max: 35 },
    { label: t.atmosphere.pollutants.pm10, value: airQuality.pm10, unit: 'µg/m³', max: 55 },
    { label: t.atmosphere.pollutants.ozone, value: airQuality.ozone, unit: 'µg/m³', max: 120 },
    { label: t.atmosphere.pollutants.no2, value: airQuality.no2, unit: 'µg/m³', max: 80 },
    { label: t.atmosphere.pollutants.so2, value: airQuality.so2, unit: 'µg/m³', max: 40 },
    { label: t.atmosphere.pollutants.co, value: airQuality.co, unit: 'µg/m³', max: 1000 },
  ];

  const lunarDay = (((Date.now() / 86400000 - 11.2) % 29.53) + 29.53) % 29.53;
  const illuminationPct = Math.round(((1 - Math.cos((lunarDay / 29.53) * Math.PI * 2)) / 2) * 100);
  const phases = t.atmosphere.lunarPhases;
  const lunarPhaseName =
    lunarDay < 2 || lunarDay > 27.5
      ? phases.newMoon
      : lunarDay < 7.4
        ? phases.waxingCrescent
        : lunarDay < 11
          ? phases.firstQuarter
          : lunarDay < 14.8
            ? phases.waxingGibbous
            : lunarDay < 17
              ? phases.fullMoon
              : lunarDay < 22.1
                ? phases.waningGibbous
                : phases.waningCrescent;

  const bestRunHour = hourly.slice(0, 12).reduce((best, cur) =>
    cur.precipProbability + cur.windSpeedKmh * 0.5 < best.precipProbability + best.windSpeedKmh * 0.5
      ? cur
      : best
  );
  const avgEveningCloud = Math.round(
    hourly.slice(12, 18).reduce((sum, h) => sum + h.cloudCover, 0) / Math.max(1, hourly.slice(12, 18).length)
  );
  const bestRunWind = formatWind(bestRunHour.windSpeedKmh, unit, lang);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
          {t.atmosphere.titlePrefix} · {location.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#bcc9ce]">{t.atmosphere.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="glass-l2 rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
              {t.atmosphere.usAqiTitle}
            </span>
            <Wind className="h-4 w-4 text-purple-600 dark:text-[#e0b6ff]" aria-hidden="true" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-5xl font-extralight text-slate-900 dark:text-white tabular-nums">
              {airQuality.usAqi}
            </span>
            <span className="text-base font-semibold text-purple-700 dark:text-[#e0b6ff]">
              {airQuality.ratingLabel}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">
            {airQuality.advisoryText}
          </p>
        </section>

        <section className="glass-l1 rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
              {t.atmosphere.solarUvPeakTitle}
            </span>
            <Sun className="h-4 w-4 text-amber-500 dark:text-[#ffb784]" aria-hidden="true" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-5xl font-extralight text-slate-900 dark:text-white tabular-nums">
              {uvMax.toFixed(1)}
            </span>
            <span className="text-base font-semibold text-amber-600 dark:text-[#ffb784]">
              {uvGuidance.level}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce]">{uvGuidance.advice}</p>
        </section>

        <section className="glass-l1 rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
              {t.atmosphere.lunarTelemetryTitle}
            </span>
            <Moon className="h-4 w-4 text-[#0284c7] dark:text-[#b3ebff]" aria-hidden="true" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-5xl font-extralight text-slate-900 dark:text-white tabular-nums">
              {lang === 'tr' ? `%${illuminationPct}` : `${illuminationPct}%`}
            </span>
            <span className="text-base font-semibold text-[#0284c7] dark:text-[#b3ebff]">
              {lunarPhaseName}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-[#bcc9ce] tabular-nums">
            {t.atmosphere.eveningCloudCover(avgEveningCloud)}
          </p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="glass-l1 rounded-3xl p-6 lg:col-span-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
            {t.atmosphere.pollutantBreakdownTitle}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pollutants.map((item) => {
              const pct = Math.min(100, Math.max(5, (item.value / item.max) * 100));
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-[#dbe1ff]">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                      {item.value} {item.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#9333ea] dark:from-[#4cd6fb] dark:to-[#ca89ff] dark:shadow-[0_0_10px_rgba(202,137,255,0.45)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass-l1 flex flex-col justify-between rounded-3xl p-6 lg:col-span-5">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
              {t.atmosphere.uvCurveTitle}
            </h2>
            <div className="mt-4 h-36 w-full">
              <svg viewBox="0 0 360 120" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="uv-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line
                  x1="0"
                  y1="108"
                  x2="360"
                  y2="108"
                  stroke={isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.12)'}
                  strokeWidth="1"
                />
                {(() => {
                  const pts = hourly.map((h, i) => {
                    const x = (i / Math.max(1, hourly.length - 1)) * 348 + 6;
                    const y = 104 - (h.uvIndex / Math.max(8, uvMax)) * 88;
                    return { x, y };
                  });
                  const lineD = pts
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                    .join(' ');
                  const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)} 108 L ${pts[0].x.toFixed(1)} 108 Z`;
                  return (
                    <>
                      <path d={areaD} fill="url(#uv-area-grad)" />
                      <path
                        d={lineD}
                        fill="none"
                        stroke={isLight ? '#d97706' : '#ffb784'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-slate-900/10 pt-4 dark:border-white/10">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {t.atmosphere.optimalWindowTitle(bestRunHour.hourLabel)}
                </div>
                <div className="text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                  {t.atmosphere.optimalWindowDetail(
                    formatTemp(bestRunHour.temperatureC, unit),
                    unit,
                    bestRunHour.precipProbability,
                    bestRunWind.value,
                    bestRunWind.label
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-[#e0b6ff]" aria-hidden="true" />
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {t.atmosphere.stargazingTitle}
                </div>
                <div className="text-slate-600 dark:text-[#bcc9ce] tabular-nums">
                  {avgEveningCloud <= 30
                    ? t.atmosphere.stargazingClear(avgEveningCloud)
                    : t.atmosphere.stargazingPartial(avgEveningCloud)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
