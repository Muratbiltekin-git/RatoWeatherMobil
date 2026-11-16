import { useEffect, useRef, useState } from 'react';
import { Layers, Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, TemperatureUnit, ThemeMode, WeatherBundle } from '../types/weather';
import { degreesToCardinal, formatTemp, formatWind } from '../services/weatherApi';

interface RadarScreenProps {
  bundle: WeatherBundle;
  unit: TemperatureUnit;
  lang: Language;
  theme: ThemeMode;
}

type RadarLayer = 'precipitation' | 'wind' | 'temperature' | 'clouds';

export function RadarScreen({
  bundle,
  unit,
  lang,
  theme,
}: RadarScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layer, setLayer] = useState<RadarLayer>('precipitation');
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameHourOffset, setFrameHourOffset] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang];
  const { location, current, hourly } = bundle;
  const windInfo = formatWind(current.windSpeedKmh, unit, lang);

  const layerOptions: Array<{ id: RadarLayer; label: string; legendMin: string; legendMax: string }> = [
    {
      id: 'precipitation',
      label: t.radar.layers.precipitation,
      legendMin: t.radar.legendMin.precipitation,
      legendMax: t.radar.legendMax.precipitation,
    },
    {
      id: 'wind',
      label: t.radar.layers.wind,
      legendMin: t.radar.legendMin.wind,
      legendMax: t.radar.legendMax.wind,
    },
    {
      id: 'temperature',
      label: t.radar.layers.temperature,
      legendMin: t.radar.legendMin.temperature,
      legendMax: t.radar.legendMax.temperature,
    },
    {
      id: 'clouds',
      label: t.radar.layers.clouds,
      legendMin: t.radar.legendMin.clouds,
      legendMax: t.radar.legendMax.clouds,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setFrameHourOffset((prev) => {
        const next = prev + 0.25;
        return next > 3 ? -2 : Number(next.toFixed(2));
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(320, rect.height);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      20,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    if (isLight) {
      bgGrad.addColorStop(0, '#eef5fc');
      bgGrad.addColorStop(1, '#d3e4f6');
    } else {
      bgGrad.addColorStop(0, '#141e3e');
      bgGrad.addColorStop(1, '#060d22');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.44 * zoom;

    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(219, 225, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = 44 * zoom;
    for (let x = cx % step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = cy % step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const rings = [0.33, 0.66, 1];
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(51, 65, 85, 0.65)' : 'rgba(188, 201, 206, 0.45)';
    rings.forEach((factor, idx) => {
      const r = maxR * factor;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.22)' : 'rgba(76, 214, 251, 0.14)';
      ctx.stroke();
      const kmLabel = `${Math.round((idx + 1) * (35 / zoom))} km`;
      ctx.fillText(kmLabel, cx + 6, cy - r + 12);
    });

    const windRad = ((current.windDirectionDeg - 90) * Math.PI) / 180;
    const driftX = Math.cos(windRad) * frameHourOffset * 26 * zoom;
    const driftY = Math.sin(windRad) * frameHourOffset * 26 * zoom;
    const citySeed = Math.abs(Math.round(location.latitude * 17 + location.longitude * 11));

    if (layer === 'precipitation' || layer === 'clouds') {
      const cellCount = layer === 'precipitation' ? 14 : 18;
      const baseIntensity =
        layer === 'precipitation'
          ? Math.max(0.28, (hourly[0]?.precipProbability ?? 30) / 100)
          : Math.max(0.35, current.cloudCover / 100);

      for (let i = 0; i < cellCount; i++) {
        const angle = ((citySeed + i * 53) % 360) * (Math.PI / 180);
        const dist = (((citySeed * 3 + i * 71) % 100) / 100) * maxR * 1.1;
        const bx = cx + Math.cos(angle) * dist + driftX;
        const by = cy + Math.sin(angle) * dist + driftY;
        const radius = (36 + ((citySeed + i * 19) % 58)) * zoom;

        const g = ctx.createRadialGradient(bx, by, 4, bx, by, radius);
        if (layer === 'precipitation') {
          if (isLight) {
            g.addColorStop(0, `rgba(126, 34, 206, ${0.42 * baseIntensity})`);
            g.addColorStop(0.45, `rgba(2, 132, 199, ${0.42 * baseIntensity})`);
            g.addColorStop(1, 'rgba(2, 132, 199, 0)');
          } else {
            g.addColorStop(0, `rgba(224, 182, 255, ${0.55 * baseIntensity})`);
            g.addColorStop(0.45, `rgba(76, 214, 251, ${0.46 * baseIntensity})`);
            g.addColorStop(1, 'rgba(0, 180, 216, 0)');
          }
        } else {
          if (isLight) {
            g.addColorStop(0, `rgba(255, 255, 255, ${0.85 * baseIntensity})`);
            g.addColorStop(0.6, `rgba(148, 163, 184, ${0.28 * baseIntensity})`);
            g.addColorStop(1, 'rgba(148, 163, 184, 0)');
          } else {
            g.addColorStop(0, `rgba(219, 225, 255, ${0.32 * baseIntensity})`);
            g.addColorStop(0.6, `rgba(188, 201, 206, ${0.15 * baseIntensity})`);
            g.addColorStop(1, 'rgba(188, 201, 206, 0)');
          }
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (layer === 'temperature') {
      const thermalGrad = ctx.createRadialGradient(
        cx + driftX * 0.4,
        cy + driftY * 0.4,
        20,
        cx,
        cy,
        maxR * 1.3
      );
      if (current.temperatureC >= 20) {
        thermalGrad.addColorStop(0, 'rgba(244, 125, 0, 0.34)');
        thermalGrad.addColorStop(0.55, 'rgba(251, 146, 60, 0.22)');
        thermalGrad.addColorStop(1, 'rgba(56, 189, 248, 0.08)');
      } else {
        thermalGrad.addColorStop(0, 'rgba(2, 132, 199, 0.28)');
        thermalGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.16)');
        thermalGrad.addColorStop(1, 'rgba(126, 34, 206, 0.12)');
      }
      ctx.fillStyle = thermalGrad;
      ctx.fillRect(0, 0, width, height);
    }

    if (layer === 'wind') {
      ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.65)' : 'rgba(76, 214, 251, 0.55)';
      ctx.lineWidth = 1.6;
      const cols = 9;
      const rows = 7;
      for (let gx = 1; gx < cols; gx++) {
        for (let gy = 1; gy < rows; gy++) {
          const px = (width / cols) * gx + ((frameHourOffset * 18) % 36);
          const py = (height / rows) * gy;
          const localAngle = windRad + Math.sin(gx * 0.7 + gy * 0.5 + frameHourOffset) * 0.22;
          const len = 18 * zoom;
          const ex = px + Math.cos(localAngle) * len;
          const ey = py + Math.sin(localAngle) * len;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(ex, ey, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? '#0284c7' : '#b3ebff';
          ctx.fill();
        }
      }
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.22)' : 'rgba(76, 214, 251, 0.22)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? '#0284c7' : '#4cd6fb';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
    ctx.fillText(location.name, cx + 14, cy + 4);
  }, [layer, frameHourOffset, zoom, location, current, hourly, isLight]);

  const activeLayerMeta = layerOptions.find((l) => l.id === layer) ?? layerOptions[0];
  const hourSuffix = lang === 'tr' ? 'sa' : 'h';
  const offsetText =
    frameHourOffset === 0
      ? t.common.now
      : frameHourOffset > 0
        ? `+${frameHourOffset.toFixed(1)}${hourSuffix}`
        : `${frameHourOffset.toFixed(1)}${hourSuffix}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
            {t.radar.titlePrefix} · {location.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#bcc9ce] tabular-nums">
            {location.latitude.toFixed(2)}° {lang === 'tr' ? 'K' : 'N'}, {location.longitude.toFixed(2)}°{' '}
            {lang === 'tr' ? 'D' : 'E'} · {t.radar.surfaceTemp} {formatTemp(current.temperatureC, unit)}°{unit} ·{' '}
            {t.common.wind} {windInfo.value} {windInfo.label} {degreesToCardinal(current.windDirectionDeg, lang)}
          </p>
        </div>

        <div
          role="group"
          aria-label="Radar data layer"
          className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-900/12 bg-white/75 p-1 dark:border-white/12 dark:bg-[#1c2541]/70"
        >
          {layerOptions.map((opt) => {
            const active = layer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLayer(opt.id)}
                className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0284c7]/15 text-slate-900 border border-[#0284c7]/35 dark:bg-[#4cd6fb]/20 dark:text-white dark:border-[#4cd6fb]/40'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#bcc9ce] dark:hover:text-white border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="glass-l2 relative overflow-hidden rounded-3xl">
        <div className="relative h-[420px] w-full sm:h-[500px]">
          <canvas ref={canvasRef} className="h-full w-full block" />

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.2).toFixed(1))))}
              aria-label={t.radar.zoomIn}
              className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-900/12 bg-white/85 text-slate-800 backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-[#0b132b]/80 dark:text-white dark:hover:bg-white/15"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.2).toFixed(1))))}
              aria-label={t.radar.zoomOut}
              className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-900/12 bg-white/85 text-slate-800 backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-[#0b132b]/80 dark:text-white dark:hover:bg-white/15"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setFrameHourOffset(0);
              }}
              aria-label={t.radar.resetView}
              className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-900/12 bg-white/85 text-[#0284c7] backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-[#0b132b]/80 dark:text-[#4cd6fb] dark:hover:bg-white/15"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute left-4 top-4 rounded-2xl border border-slate-900/12 bg-white/85 px-3.5 py-2.5 backdrop-blur-md dark:border-white/12 dark:bg-[#0b132b]/80">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-700 dark:text-[#bcc9ce]">
              <Layers className="h-3.5 w-3.5 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
              <span>{activeLayerMeta.label}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 dark:text-[#869398]">{activeLayerMeta.legendMin}</span>
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[#0284c7] via-[#9333ea] to-[#ea580c] dark:from-[#4cd6fb] dark:via-[#ca89ff] dark:to-[#ffb784]" />
              <span className="text-[10px] text-slate-500 dark:text-[#869398]">{activeLayerMeta.legendMax}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-900/10 bg-white/75 px-5 py-4 dark:border-white/10 dark:bg-[#0b132b]/65">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? t.radar.pause : t.radar.play}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(0,180,216,0.35)]"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? t.radar.pause : t.radar.play}</span>
          </button>

          <div className="flex flex-1 items-center gap-3 min-w-[200px]">
            <span className="text-xs text-slate-500 dark:text-[#869398] tabular-nums">-2{hourSuffix}</span>
            <input
              type="range"
              min={-2}
              max={3}
              step={0.25}
              value={frameHourOffset}
              aria-label={t.radar.offset}
              onChange={(e) => {
                setIsPlaying(false);
                setFrameHourOffset(Number(e.target.value));
              }}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-900/15 accent-[#0284c7] dark:bg-white/15 dark:accent-[#4cd6fb]"
            />
            <span className="text-xs text-slate-500 dark:text-[#869398] tabular-nums">+3{hourSuffix}</span>
          </div>

          <div className="font-mono text-xs font-medium text-[#0284c7] dark:text-[#4cd6fb] tabular-nums">
            {t.radar.offset}: {offsetText}
          </div>
        </div>
      </section>
    </div>
  );
}
