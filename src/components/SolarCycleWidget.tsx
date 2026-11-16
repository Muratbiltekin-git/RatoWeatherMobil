import { useId, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Sunrise, Sunset } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { formatIsoClock } from '../services/weatherApi';
import type { Language, ThemeMode } from '../types/weather';

interface SolarCycleWidgetProps {
  sunriseIso: string;
  sunsetIso: string;
  timezone: string;
  lang: Language;
  theme: ThemeMode;
}

interface SolarPoint {
  minute: number;
  elevation: number;
}

function parseMinutesFromIso(iso: string): number {
  const timePart = iso.split('T')[1];
  if (!timePart) return 360;
  const [hhStr, mmStr] = timePart.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return 360;
  return hh * 60 + mm;
}

function getLocalMinutes(timezone: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
    const [hh, mm] = parts.split(':').map(Number);
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      return (hh % 24) * 60 + mm;
    }
  } catch {
    // fallback below
  }
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function formatMinutesClock(totalMins: number, lang: Language): string {
  const normalized = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const hh = Math.floor(normalized / 60);
  const mm = normalized % 60;
  if (lang === 'tr') {
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  const suffix = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

function formatDuration(mins: number, lang: Language): string {
  const safe = Math.max(0, Math.round(mins));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  if (lang === 'tr') {
    return `${h} sa ${m} dk`;
  }
  return `${h}h ${m}m`;
}

export function SolarCycleWidget({
  sunriseIso,
  sunsetIso,
  timezone,
  lang,
  theme,
}: SolarCycleWidgetProps) {
  const uid = useId().replace(/:/g, '');
  const [hoverMinute, setHoverMinute] = useState<number | null>(null);

  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang];
  const sc = t.solarCycle;

  const sunriseMin = parseMinutesFromIso(sunriseIso);
  const sunsetMin = Math.max(sunriseMin + 60, parseMinutesFromIso(sunsetIso));
  const nowMin = getLocalMinutes(timezone);
  const solarNoonMin = (sunriseMin + sunsetMin) / 2;
  const daylightMins = sunsetMin - sunriseMin;

  const isDaytime = nowMin >= sunriseMin && nowMin <= sunsetMin;
  const daylightProgressPct = Math.round(
    Math.max(0, Math.min(1, (nowMin - sunriseMin) / Math.max(1, daylightMins))) * 100
  );

  const nextCountdown = isDaytime
    ? formatDuration(sunsetMin - nowMin, lang)
    : nowMin < sunriseMin
      ? formatDuration(sunriseMin - nowMin, lang)
      : formatDuration(1440 - nowMin + sunriseMin, lang);

  const width = 680;
  const height = 210;
  const margin = { top: 24, right: 26, bottom: 32, left: 26 };
  const innerW = width - margin.left - margin.right;
  const horizonY = 144;
  const peakTopY = margin.top + 8;
  const nightBottomY = height - margin.bottom;

  const xScale = useMemo(
    () => d3.scaleLinear().domain([0, 1440]).range([margin.left, margin.left + innerW]),
    [margin.left, innerW]
  );

  const elevationAtMinute = useMemo(() => {
    const nightBefore = sunriseMin;
    const nightAfter = 1440 - sunsetMin;
    const totalNight = Math.max(60, nightBefore + nightAfter);

    return (m: number): number => {
      if (m >= sunriseMin && m <= sunsetMin) {
        const phase = (m - sunriseMin) / Math.max(1, daylightMins);
        return Math.sin(phase * Math.PI);
      }
      const nightElapsed = m > sunsetMin ? m - sunsetMin : nightAfter + m;
      const nightPhase = nightElapsed / totalNight;
      return -Math.sin(nightPhase * Math.PI) * 0.42;
    };
  }, [sunriseMin, sunsetMin, daylightMins]);

  const yScale = useMemo(() => {
    return (elev: number) => {
      if (elev >= 0) {
        return horizonY - elev * (horizonY - peakTopY);
      }
      return horizonY + Math.abs(elev) * ((nightBottomY - horizonY) / 0.42);
    };
  }, [horizonY, peakTopY, nightBottomY]);

  const {
    fullCurvePath,
    daylightElapsedPath,
    daylightAreaPath,
    nightPointsPath,
    sunPoint,
    sunriseX,
    sunsetX,
    noonX,
    points,
  } = useMemo(() => {
    const step = 10;
    const pts: SolarPoint[] = [];
    for (let m = 0; m <= 1440; m += step) {
      pts.push({ minute: m, elevation: elevationAtMinute(m) });
    }

    const lineGen = d3
      .line<SolarPoint>()
      .x((d) => xScale(d.minute))
      .y((d) => yScale(d.elevation))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGen = d3
      .area<SolarPoint>()
      .x((d) => xScale(d.minute))
      .y0(horizonY)
      .y1((d) => yScale(Math.max(0, d.elevation)))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const dayPts: SolarPoint[] = [];
    for (let m = sunriseMin; m <= sunsetMin; m += 6) {
      dayPts.push({ minute: m, elevation: elevationAtMinute(m) });
    }
    if (dayPts[dayPts.length - 1]?.minute !== sunsetMin) {
      dayPts.push({ minute: sunsetMin, elevation: 0 });
    }

    const elapsedPts: SolarPoint[] = [];
    const clampedEnd = Math.min(sunsetMin, Math.max(sunriseMin, nowMin));
    if (nowMin >= sunriseMin) {
      for (let m = sunriseMin; m <= clampedEnd; m += 6) {
        elapsedPts.push({ minute: m, elevation: elevationAtMinute(m) });
      }
      if (elapsedPts[elapsedPts.length - 1]?.minute !== clampedEnd) {
        elapsedPts.push({ minute: clampedEnd, elevation: elevationAtMinute(clampedEnd) });
      }
    }

    const curElev = elevationAtMinute(nowMin);

    return {
      fullCurvePath: lineGen(pts) ?? '',
      daylightElapsedPath: elapsedPts.length > 1 ? (lineGen(elapsedPts) ?? '') : '',
      daylightAreaPath: areaGen(dayPts) ?? '',
      nightPointsPath: lineGen(pts) ?? '',
      sunPoint: { x: xScale(nowMin), y: yScale(curElev), elev: curElev },
      sunriseX: xScale(sunriseMin),
      sunsetX: xScale(sunsetMin),
      noonX: xScale(solarNoonMin),
      points: pts,
    };
  }, [elevationAtMinute, xScale, yScale, sunriseMin, sunsetMin, nowMin, solarNoonMin, horizonY]);

  const bisectMinute = useMemo(() => d3.bisector<SolarPoint, number>((d) => d.minute).left, []);

  const inspected = useMemo(() => {
    if (hoverMinute === null) return null;
    const clamped = Math.max(0, Math.min(1440, hoverMinute));
    const idx = Math.min(points.length - 1, bisectMinute(points, clamped));
    const pt = points[idx];
    if (!pt) return null;
    const elev = elevationAtMinute(clamped);
    const degrees = Math.round(elev * 68);
    return {
      minute: clamped,
      x: xScale(clamped),
      y: yScale(elev),
      elev,
      degrees,
      clock: formatMinutesClock(clamped, lang),
    };
  }, [hoverMinute, points, bisectMinute, elevationAtMinute, xScale, yScale, lang]);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const m = xScale.invert(relX);
    setHoverMinute(Math.max(0, Math.min(1440, m)));
  };

  const horizonStroke = isLight ? 'rgba(15, 23, 42, 0.16)' : 'rgba(255, 255, 255, 0.2)';
  const nightBandFill = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(5, 13, 37, 0.32)';
  const nightStroke = isLight ? 'rgba(71, 85, 105, 0.32)' : 'rgba(188, 201, 206, 0.28)';
  const futureTrackStroke = isLight ? 'rgba(234, 88, 12, 0.30)' : 'rgba(255, 183, 132, 0.32)';
  const noonLineStroke = isLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.08)';
  const labelMutedFill = isLight ? '#64748b' : '#869398';
  const labelPrimaryFill = isLight ? '#0f172a' : '#dbe1ff';
  const markerBorderStroke = isLight ? '#ffffff' : '#0a122a';

  return (
    <section className="glass-l1 rounded-3xl p-5 sm:p-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-[#94a3b8]">
            {sc.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {isDaytime ? sc.aboveHorizon : sc.belowHorizon}
            </span>
            <span aria-hidden="true" className="text-slate-400 dark:text-[#869398]">·</span>
            <span className="text-xs font-medium text-amber-600 dark:text-[#ffb784] tabular-nums">
              {isDaytime ? sc.progressLabel(daylightProgressPct) : `${sc.untilSunrise}: ${nextCountdown}`}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-600 dark:text-[#bcc9ce] tabular-nums">
          {inspected ? (
            <span className="font-mono font-medium text-amber-600 dark:text-[#ffb784]">
              {inspected.clock} · {sc.elevation}: {inspected.degrees}°
            </span>
          ) : (
            <span className="text-slate-500 dark:text-[#869398]">{sc.scrubPrompt}</span>
          )}
        </div>
      </div>

      {/* D3 Dynamic Solar Arc SVG */}
      <div className="mt-4 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-48 w-full touch-pan-y select-none sm:h-52"
          role="img"
          aria-label={`${sc.title}: ${formatIsoClock(sunriseIso, lang)} - ${formatIsoClock(sunsetIso, lang)}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverMinute(null)}
        >
          <defs>
            <linearGradient id={`solar-area-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isLight ? '#f59e0b' : '#ffb784'} stopOpacity={isLight ? '0.28' : '0.34'} />
              <stop offset="65%" stopColor="#f47d00" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f47d00" stopOpacity="0.01" />
            </linearGradient>

            <linearGradient id={`solar-stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor={isLight ? '#ea580c' : '#ffdcc6'} />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <clipPath id={`above-horizon-${uid}`}>
              <rect x={0} y={0} width={width} height={horizonY} />
            </clipPath>

            <clipPath id={`below-horizon-${uid}`}>
              <rect x={0} y={horizonY} width={width} height={height - horizonY} />
            </clipPath>

            <radialGradient id={`sun-glow-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#fb923c" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#f47d00" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect
            x={margin.left}
            y={horizonY}
            width={innerW}
            height={nightBottomY - horizonY}
            fill={nightBandFill}
            rx={6}
          />

          <path d={daylightAreaPath} fill={`url(#solar-area-${uid})`} />

          <path
            d={nightPointsPath}
            fill="none"
            stroke={nightStroke}
            strokeWidth="1.75"
            strokeDasharray="4 4"
            clipPath={`url(#below-horizon-${uid})`}
          />

          <path
            d={fullCurvePath}
            fill="none"
            stroke={futureTrackStroke}
            strokeWidth="2.2"
            clipPath={`url(#above-horizon-${uid})`}
          />

          {daylightElapsedPath && (
            <path
              d={daylightElapsedPath}
              fill="none"
              stroke={`url(#solar-stroke-${uid})`}
              strokeWidth="3.2"
              strokeLinecap="round"
              clipPath={`url(#above-horizon-${uid})`}
            />
          )}

          <line
            x1={margin.left}
            y1={horizonY}
            x2={margin.left + innerW}
            y2={horizonY}
            stroke={horizonStroke}
            strokeWidth="1"
          />

          <line
            x1={noonX}
            y1={peakTopY}
            x2={noonX}
            y2={horizonY}
            stroke={noonLineStroke}
            strokeDasharray="3 3"
          />
          <text
            x={noonX}
            y={peakTopY - 8}
            textAnchor="middle"
            fill={labelMutedFill}
            fontSize="10"
            fontWeight="600"
          >
            {sc.solarNoon} · {formatMinutesClock(solarNoonMin, lang)}
          </text>

          <circle cx={sunriseX} cy={horizonY} r="4" fill="#f59e0b" stroke={markerBorderStroke} strokeWidth="1.5" />
          <text
            x={sunriseX}
            y={horizonY + 18}
            textAnchor="middle"
            fill={labelPrimaryFill}
            fontSize="11"
            fontWeight="600"
            className="tabular-nums"
          >
            {formatIsoClock(sunriseIso, lang)}
          </text>

          <circle cx={sunsetX} cy={horizonY} r="4" fill="#ea580c" stroke={markerBorderStroke} strokeWidth="1.5" />
          <text
            x={sunsetX}
            y={horizonY + 18}
            textAnchor="middle"
            fill={labelPrimaryFill}
            fontSize="11"
            fontWeight="600"
            className="tabular-nums"
          >
            {formatIsoClock(sunsetIso, lang)}
          </text>

          <text x={margin.left} y={height - 6} textAnchor="start" fill={labelMutedFill} fontSize="10">
            {lang === 'tr' ? '00:00' : '12 AM'}
          </text>
          <text x={margin.left + innerW} y={height - 6} textAnchor="end" fill={labelMutedFill} fontSize="10">
            {lang === 'tr' ? '24:00' : '12 AM'}
          </text>

          {inspected && (
            <g pointerEvents="none">
              <line
                x1={inspected.x}
                y1={margin.top}
                x2={inspected.x}
                y2={horizonY}
                stroke={isLight ? 'rgba(2, 132, 199, 0.5)' : 'rgba(76, 214, 251, 0.45)'}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={inspected.x}
                cy={inspected.y}
                r="5"
                fill={isLight ? '#0284c7' : '#4cd6fb'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}

          <g pointerEvents="none">
            {isDaytime ? (
              <>
                <circle cx={sunPoint.x} cy={sunPoint.y} r="18" fill={`url(#sun-glow-${uid})`} />
                <circle
                  cx={sunPoint.x}
                  cy={sunPoint.y}
                  r="6.5"
                  fill="#fde68a"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
              </>
            ) : (
              <>
                <circle
                  cx={sunPoint.x}
                  cy={sunPoint.y}
                  r="12"
                  fill={isLight ? 'rgba(126, 34, 206, 0.16)' : 'rgba(224, 182, 255, 0.16)'}
                />
                <circle
                  cx={sunPoint.x}
                  cy={sunPoint.y}
                  r="5.5"
                  fill={isLight ? '#9333ea' : '#e0b6ff'}
                  stroke={markerBorderStroke}
                  strokeWidth="2"
                />
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Footer Telemetry Breakdown */}
      <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-900/10 pt-4 dark:border-white/10 sm:grid-cols-4 tabular-nums">
        <div className="flex items-center gap-2.5">
          <Sunrise className="h-4 w-4 shrink-0 text-amber-500 dark:text-[#ffb784]" aria-hidden="true" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
              {t.common.sunrise}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {formatIsoClock(sunriseIso, lang)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Sunset className="h-4 w-4 shrink-0 text-orange-600 dark:text-[#f47d00]" aria-hidden="true" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
              {t.common.sunset}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {formatIsoClock(sunsetIso, lang)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
            {sc.daylightSpan}
          </div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            {formatDuration(daylightMins, lang)}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-[#869398]">
            {isDaytime ? sc.remainingDaylight : sc.untilSunrise}
          </div>
          <div className="text-sm font-semibold text-amber-600 dark:text-[#ffb784]">{nextCountdown}</div>
        </div>
      </div>
    </section>
  );
}
