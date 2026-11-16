import { TRANSLATIONS } from '../i18n/translations';
import type {
  AirQualityData,
  CityLocation,
  CitySummary,
  DailyForecastItem,
  HourlyForecastItem,
  Language,
  TemperatureUnit,
  WeatherBundle,
  WeatherConditionKind,
} from '../types/weather';

export const DEFAULT_CITIES: CityLocation[] = [
  {
    id: 'sf-us',
    name: 'San Francisco',
    region: 'California',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'istanbul-tr',
    name: 'İstanbul',
    region: 'Marmara',
    country: 'Türkiye',
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: 'Europe/Istanbul',
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'london-gb',
    name: 'London',
    region: 'England',
    country: 'United Kingdom',
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: 'Europe/London',
  },
  {
    id: 'reykjavik-is',
    name: 'Reykjavik',
    region: 'Capital Region',
    country: 'Iceland',
    latitude: 64.1466,
    longitude: -21.9426,
    timezone: 'Atlantic/Reykjavik',
  },
  {
    id: 'nyc-us',
    name: 'New York',
    region: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
];

export function formatTemp(tempC: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function formatWind(
  speedKmh: number,
  unit: TemperatureUnit,
  lang: Language = 'en'
): { value: number; label: string } {
  if (unit === 'F') {
    return { value: Math.round(speedKmh * 0.621371), label: 'mph' };
  }
  return { value: Math.round(speedKmh), label: lang === 'tr' ? 'km/sa' : 'km/h' };
}

export function formatVisibility(km: number, unit: TemperatureUnit): { value: string; label: string } {
  if (unit === 'F') {
    return { value: (km * 0.621371).toFixed(1), label: 'mi' };
  }
  return { value: km.toFixed(1), label: 'km' };
}

export function degreesToCardinal(deg: number, lang: Language = 'en'): string {
  const dirsEn = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const dirsTr = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'];
  const dirs = lang === 'tr' ? dirsTr : dirsEn;
  const normalized = ((deg % 360) + 360) % 360;
  return dirs[Math.round(normalized / 22.5) % 16];
}

export function formatLocalTime(timezone: string, lang: Language = 'en', date = new Date()): string {
  try {
    return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      timeZone: timezone,
      hour: lang === 'tr' ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: lang !== 'tr',
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

export function formatIsoClock(iso: string, lang: Language = 'en'): string {
  const timePart = iso.split('T')[1];
  if (!timePart) return iso;
  const [hhStr, mmStr] = timePart.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return iso;
  if (lang === 'tr') {
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  const suffix = hh >= 12 ? 'PM' : 'AM';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${hour12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

export function formatHourShort(iso: string, lang: Language = 'en'): string {
  const timePart = iso.split('T')[1];
  if (!timePart) return iso;
  const hh = Number(timePart.split(':')[0]);
  if (Number.isNaN(hh)) return iso;
  if (lang === 'tr') {
    return `${String(hh).padStart(2, '0')}:00`;
  }
  if (hh === 0) return '12 AM';
  if (hh === 12) return '12 PM';
  return hh > 12 ? `${hh - 12} PM` : `${hh} AM`;
}

export function mapWmoCode(
  code: number,
  isDay: boolean,
  lang: Language = 'en'
): { label: string; kind: WeatherConditionKind } {
  const t = TRANSLATIONS[lang].conditions;
  if (code === 0) {
    return { label: isDay ? t['clear-day'] : t['clear-night'], kind: isDay ? 'clear-day' : 'clear-night' };
  }
  if (code === 1) {
    return { label: isDay ? t['mainly-clear'] : t['mostly-clear'], kind: isDay ? 'clear-day' : 'clear-night' };
  }
  if (code === 2) {
    return { label: t['partly-cloudy'], kind: 'partly-cloudy' };
  }
  if (code === 3) {
    return { label: t.cloudy, kind: 'cloudy' };
  }
  if (code === 45 || code === 48) {
    return { label: t.fog, kind: 'fog' };
  }
  if (code >= 51 && code <= 57) {
    return { label: t.drizzle, kind: 'drizzle' };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: code === 65 || code === 82 ? t['heavy-rain'] : t.rain, kind: 'rain' };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { label: t.snow, kind: 'snow' };
  }
  if (code >= 95) {
    return { label: t.storm, kind: 'storm' };
  }
  return { label: t['partly-cloudy'], kind: 'partly-cloudy' };
}

export function classifyAqi(usAqi: number, lang: Language = 'en'): { rating: string; advisory: string } {
  const aqiT = TRANSLATIONS[lang].aqi;
  if (usAqi <= 50) return aqiT.good;
  if (usAqi <= 100) return aqiT.moderate;
  if (usAqi <= 150) return aqiT.sensitive;
  return aqiT.unhealthy;
}

export function getUvGuidance(uv: number, lang: Language = 'en'): { level: string; advice: string } {
  const uvT = TRANSLATIONS[lang].uv;
  if (uv < 3) return uvT.low;
  if (uv < 6) return uvT.moderate;
  if (uv < 8) return uvT.high;
  if (uv < 11) return uvT.veryHigh;
  return uvT.extreme;
}

function buildFallbackBundle(location: CityLocation, lang: Language): WeatherBundle {
  const t = TRANSLATIONS[lang];
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const seed = Math.abs(Math.round(location.latitude * 13 + location.longitude * 7));
  const baseTemp =
    Math.abs(location.latitude) > 55
      ? 6 + (seed % 5)
      : Math.abs(location.latitude) > 45
        ? 12 + (seed % 6)
        : 16 + (seed % 8);
  const wmoPool = [1, 2, 3, 61, 0, 2];
  const currentCode = wmoPool[seed % wmoPool.length];
  const now = new Date();
  const currentHour = now.getHours();
  const isDay = currentHour >= 6 && currentHour <= 19;
  const mapped = mapWmoCode(currentCode, isDay, lang);

  const todayIso = now.toISOString().split('T')[0];
  const sunriseIso = `${todayIso}T06:34`;
  const sunsetIso = `${todayIso}T17:42`;

  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }, (_, idx) => {
    const hDate = new Date(now.getTime() + idx * 3600_000);
    const h = hDate.getHours();
    const hDay = h >= 6 && h <= 19;
    const wave = Math.sin(((h - 5) / 24) * Math.PI * 2) * 3.8;
    const code = idx % 7 === 4 ? 61 : idx % 5 === 0 ? 2 : currentCode;
    const cond = mapWmoCode(code, hDay, lang);
    const iso = `${hDate.toISOString().slice(0, 13)}:00`;
    return {
      timeIso: iso,
      hourLabel: idx === 0 ? t.common.now : formatHourShort(iso, lang),
      temperatureC: Number((baseTemp + wave).toFixed(1)),
      feelsLikeC: Number((baseTemp + wave - 1.1).toFixed(1)),
      precipProbability: code >= 61 ? 65 : code === 2 ? 20 : 5,
      precipitationMm: code >= 61 ? 1.4 : 0,
      windSpeedKmh: 12 + ((seed + idx * 3) % 14),
      windDirectionDeg: (265 + idx * 8) % 360,
      uvIndex: hDay ? Math.max(0, Number((Math.sin(((h - 6) / 13) * Math.PI) * 6.5).toFixed(1))) : 0,
      humidity: 58 + ((seed + idx * 2) % 24),
      cloudCover: code === 0 ? 8 : code === 2 ? 42 : 76,
      isDay: hDay,
      weatherCode: code,
      conditionLabel: cond.label,
      conditionKind: cond.kind,
    };
  });

  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const daily: DailyForecastItem[] = Array.from({ length: 10 }, (_, idx) => {
    const dDate = new Date(now.getTime() + idx * 86_400_000);
    const dIso = dDate.toISOString().split('T')[0];
    const dCode = wmoPool[(seed + idx) % wmoPool.length];
    const dCond = mapWmoCode(dCode, true, lang);
    const delta = Math.sin(idx * 0.8) * 2.6;
    return {
      dateIso: dIso,
      dayName: idx === 0 ? t.common.today : weekdayFmt.format(dDate),
      shortDate: dDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
      tempMaxC: Math.round(baseTemp + 4 + delta),
      tempMinC: Math.round(baseTemp - 4 + delta * 0.6),
      precipProbabilityMax: dCode >= 61 ? 70 : dCode === 2 ? 25 : 10,
      precipitationSumMm: dCode >= 61 ? 4.8 : 0,
      uvIndexMax: dCode >= 61 ? 3.2 : 6.4,
      windSpeedMaxKmh: 18 + ((seed + idx * 5) % 16),
      sunriseIso: `${dIso}T06:35`,
      sunsetIso: `${dIso}T17:40`,
      weatherCode: dCode,
      conditionLabel: dCond.label,
      conditionKind: dCond.kind,
    };
  });

  const usAqi = 24 + (seed % 32);
  const aqiMeta = classifyAqi(usAqi, lang);
  const airQuality: AirQualityData = {
    usAqi,
    pm25: Number((5.4 + (seed % 8) * 0.7).toFixed(1)),
    pm10: Number((12.2 + (seed % 10) * 0.9).toFixed(1)),
    ozone: 48 + (seed % 22),
    no2: 14 + (seed % 11),
    so2: 3 + (seed % 4),
    co: 210 + (seed % 60),
    ratingLabel: aqiMeta.rating,
    advisoryText: aqiMeta.advisory,
  };

  return {
    location,
    current: {
      temperatureC: baseTemp,
      feelsLikeC: baseTemp - 1.2,
      humidity: 64 + (seed % 18),
      dewPointC: baseTemp - 6.5,
      pressureHpa: 1016 + (seed % 9),
      pressureTrend: seed % 3 === 0 ? 'rising' : seed % 3 === 1 ? 'steady' : 'falling',
      windSpeedKmh: 16 + (seed % 12),
      windGustsKmh: 28 + (seed % 15),
      windDirectionDeg: (290 + seed * 11) % 360,
      uvIndex: isDay ? 5.2 : 0,
      visibilityKm: 16.0,
      cloudCover: currentCode === 0 ? 10 : 48,
      precipitationMm: currentCode >= 61 ? 1.2 : 0,
      isDay,
      weatherCode: currentCode,
      conditionLabel: mapped.label,
      conditionKind: mapped.kind,
      highC: daily[0].tempMaxC,
      lowC: daily[0].tempMinC,
      sunriseIso,
      sunsetIso,
    },
    hourly,
    daily,
    airQuality,
    fetchedAtIso: now.toISOString(),
    source: 'cached',
  };
}

export async function fetchWeatherForCity(
  location: CityLocation,
  lang: Language = 'en'
): Promise<WeatherBundle> {
  const t = TRANSLATIONS[lang];
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.searchParams.set('latitude', String(location.latitude));
  forecastUrl.searchParams.set('longitude', String(location.longitude));
  forecastUrl.searchParams.set('timezone', location.timezone || 'auto');
  forecastUrl.searchParams.set('forecast_days', '10');
  forecastUrl.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(',')
  );
  forecastUrl.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'relative_humidity_2m',
      'dew_point_2m',
      'surface_pressure',
      'is_day',
    ].join(',')
  );
  forecastUrl.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(',')
  );

  const aqiUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  aqiUrl.searchParams.set('latitude', String(location.latitude));
  aqiUrl.searchParams.set('longitude', String(location.longitude));
  aqiUrl.searchParams.set('timezone', location.timezone || 'auto');
  aqiUrl.searchParams.set(
    'current',
    'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide'
  );

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7500);
    const [forecastRes, aqiRes] = await Promise.all([
      fetch(forecastUrl.toString(), { signal: controller.signal }),
      fetch(aqiUrl.toString(), { signal: controller.signal }).catch(() => null),
    ]);
    window.clearTimeout(timer);

    if (!forecastRes.ok) {
      throw new Error(`Weather API status ${forecastRes.status}`);
    }

    const fData = await forecastRes.json();
    const aData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

    const currentTimeStr: string = fData.current?.time ?? '';
    const hourlyTimes: string[] = fData.hourly?.time ?? [];
    let startIdx = hourlyTimes.findIndex((tm) => tm >= currentTimeStr.slice(0, 13));
    if (startIdx < 0) startIdx = 0;

    const hourlySlice = hourlyTimes.slice(startIdx, startIdx + 24);
    const hourly: HourlyForecastItem[] = hourlySlice.map((tm, offset) => {
      const i = startIdx + offset;
      const isDay = Boolean(fData.hourly.is_day?.[i] ?? 1);
      const code = Number(fData.hourly.weather_code?.[i] ?? 0);
      const mapped = mapWmoCode(code, isDay, lang);
      return {
        timeIso: tm,
        hourLabel: offset === 0 ? t.common.now : formatHourShort(tm, lang),
        temperatureC: Number(fData.hourly.temperature_2m?.[i] ?? 15),
        feelsLikeC: Number(fData.hourly.apparent_temperature?.[i] ?? 15),
        precipProbability: Number(fData.hourly.precipitation_probability?.[i] ?? 0),
        precipitationMm: Number(fData.hourly.precipitation?.[i] ?? 0),
        windSpeedKmh: Number(fData.hourly.wind_speed_10m?.[i] ?? 10),
        windDirectionDeg: Number(fData.hourly.wind_direction_10m?.[i] ?? 0),
        uvIndex: Number(fData.hourly.uv_index?.[i] ?? 0),
        humidity: Number(fData.hourly.relative_humidity_2m?.[i] ?? 60),
        cloudCover: Number(fData.hourly.cloud_cover?.[i] ?? 20),
        isDay,
        weatherCode: code,
        conditionLabel: mapped.label,
        conditionKind: mapped.kind,
      };
    });

    const dailyTimes: string[] = fData.daily?.time ?? [];
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
    const monthDayFmt = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' });

    const daily: DailyForecastItem[] = dailyTimes.map((dStr, i) => {
      const code = Number(fData.daily.weather_code?.[i] ?? 0);
      const mapped = mapWmoCode(code, true, lang);
      const parsed = new Date(`${dStr}T12:00:00Z`);
      return {
        dateIso: dStr,
        dayName: i === 0 ? t.common.today : weekdayFmt.format(parsed),
        shortDate: monthDayFmt.format(parsed),
        tempMaxC: Math.round(Number(fData.daily.temperature_2m_max?.[i] ?? 18)),
        tempMinC: Math.round(Number(fData.daily.temperature_2m_min?.[i] ?? 10)),
        precipProbabilityMax: Number(fData.daily.precipitation_probability_max?.[i] ?? 0),
        precipitationSumMm: Number(fData.daily.precipitation_sum?.[i] ?? 0),
        uvIndexMax: Number(fData.daily.uv_index_max?.[i] ?? 0),
        windSpeedMaxKmh: Number(fData.daily.wind_speed_10m_max?.[i] ?? 12),
        sunriseIso: String(fData.daily.sunrise?.[i] ?? `${dStr}T06:30`),
        sunsetIso: String(fData.daily.sunset?.[i] ?? `${dStr}T18:00`),
        weatherCode: code,
        conditionLabel: mapped.label,
        conditionKind: mapped.kind,
      };
    });

    const curIsDay = Boolean(fData.current?.is_day ?? 1);
    const curCode = Number(fData.current?.weather_code ?? 0);
    const curMapped = mapWmoCode(curCode, curIsDay, lang);

    const pNow = Number(fData.current?.surface_pressure ?? 1013);
    const pFuture = Number(fData.hourly?.surface_pressure?.[Math.min(startIdx + 3, hourlyTimes.length - 1)] ?? pNow);
    const pressureTrend = pFuture - pNow > 1.2 ? 'rising' : pFuture - pNow < -1.2 ? 'falling' : 'steady';

    const usAqi = Number(aData?.current?.us_aqi ?? 28);
    const aqiMeta = classifyAqi(usAqi, lang);

    const resolvedLocation: CityLocation = {
      ...location,
      timezone: fData.timezone || location.timezone,
    };

    return {
      location: resolvedLocation,
      current: {
        temperatureC: Number(fData.current?.temperature_2m ?? hourly[0]?.temperatureC ?? 18),
        feelsLikeC: Number(fData.current?.apparent_temperature ?? hourly[0]?.feelsLikeC ?? 17),
        humidity: Number(fData.current?.relative_humidity_2m ?? 60),
        dewPointC: Number(fData.hourly?.dew_point_2m?.[startIdx] ?? 10),
        pressureHpa: Math.round(pNow),
        pressureTrend,
        windSpeedKmh: Number(fData.current?.wind_speed_10m ?? 12),
        windGustsKmh: Number(fData.current?.wind_gusts_10m ?? 20),
        windDirectionDeg: Number(fData.current?.wind_direction_10m ?? 270),
        uvIndex: Number(fData.hourly?.uv_index?.[startIdx] ?? 0),
        visibilityKm: Number(((fData.hourly?.visibility?.[startIdx] ?? 16000) / 1000).toFixed(1)),
        cloudCover: Number(fData.current?.cloud_cover ?? 25),
        precipitationMm: Number(fData.current?.precipitation ?? 0),
        isDay: curIsDay,
        weatherCode: curCode,
        conditionLabel: curMapped.label,
        conditionKind: curMapped.kind,
        highC: daily[0]?.tempMaxC ?? 20,
        lowC: daily[0]?.tempMinC ?? 12,
        sunriseIso: daily[0]?.sunriseIso ?? `${dailyTimes[0] ?? '2026-01-01'}T06:30`,
        sunsetIso: daily[0]?.sunsetIso ?? `${dailyTimes[0] ?? '2026-01-01'}T18:00`,
      },
      hourly,
      daily,
      airQuality: {
        usAqi: Math.round(usAqi),
        pm25: Number((aData?.current?.pm2_5 ?? 6.2).toFixed(1)),
        pm10: Number((aData?.current?.pm10 ?? 14.1).toFixed(1)),
        ozone: Math.round(Number(aData?.current?.ozone ?? 52)),
        no2: Math.round(Number(aData?.current?.nitrogen_dioxide ?? 16)),
        so2: Math.round(Number(aData?.current?.sulphur_dioxide ?? 4)),
        co: Math.round(Number(aData?.current?.carbon_monoxide ?? 230)),
        ratingLabel: aqiMeta.rating,
        advisoryText: aqiMeta.advisory,
      },
      fetchedAtIso: new Date().toISOString(),
      source: 'live',
    };
  } catch {
    return buildFallbackBundle(location, lang);
  }
}

export async function fetchCitySummaries(
  cities: CityLocation[],
  lang: Language = 'en'
): Promise<CitySummary[]> {
  if (cities.length === 0) return [];
  try {
    const lats = cities.map((c) => c.latitude).join(',');
    const lons = cities.map((c) => c.longitude).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6500);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) throw new Error('Batch summary fetch failed');
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : [raw];

    return cities.map((city, idx) => {
      const entry = arr[idx];
      if (!entry?.current) {
        const fb = buildFallbackBundle(city, lang);
        return {
          location: city,
          temperatureC: fb.current.temperatureC,
          highC: fb.current.highC,
          lowC: fb.current.lowC,
          humidity: fb.current.humidity,
          windSpeedKmh: fb.current.windSpeedKmh,
          conditionLabel: fb.current.conditionLabel,
          conditionKind: fb.current.conditionKind,
          isDay: fb.current.isDay,
          localTimeLabel: formatLocalTime(city.timezone, lang),
        };
      }
      const isDay = Boolean(entry.current.is_day ?? 1);
      const mapped = mapWmoCode(Number(entry.current.weather_code ?? 0), isDay, lang);
      const tz = entry.timezone || city.timezone;
      return {
        location: { ...city, timezone: tz },
        temperatureC: Number(entry.current.temperature_2m ?? 18),
        highC: Math.round(Number(entry.daily?.temperature_2m_max?.[0] ?? 21)),
        lowC: Math.round(Number(entry.daily?.temperature_2m_min?.[0] ?? 12)),
        humidity: Number(entry.current.relative_humidity_2m ?? 60),
        windSpeedKmh: Number(entry.current.wind_speed_10m ?? 14),
        conditionLabel: mapped.label,
        conditionKind: mapped.kind,
        isDay,
        localTimeLabel: formatLocalTime(tz, lang),
      };
    });
  } catch {
    return cities.map((city) => {
      const fb = buildFallbackBundle(city, lang);
      return {
        location: city,
        temperatureC: fb.current.temperatureC,
        highC: fb.current.highC,
        lowC: fb.current.lowC,
        humidity: fb.current.humidity,
        windSpeedKmh: fb.current.windSpeedKmh,
        conditionLabel: fb.current.conditionLabel,
        conditionKind: fb.current.conditionKind,
        isDay: fb.current.isDay,
        localTimeLabel: formatLocalTime(city.timezone, lang),
      };
    });
  }
}

export async function searchCities(query: string, lang: Language = 'en'): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=${lang}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results: Array<{
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }> = data.results ?? [];

    return results.map((r) => ({
      id: `geo-${r.id}`,
      name: r.name,
      region: r.admin1 || r.country || '',
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone || 'UTC',
    }));
  } catch {
    const qLower = trimmed.toLowerCase();
    return DEFAULT_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(qLower) ||
        c.country.toLowerCase().includes(qLower) ||
        c.region.toLowerCase().includes(qLower)
    );
  }
}

export async function reverseGeocodeCity(
  latitude: number,
  longitude: number,
  lang: Language = 'en'
): Promise<CityLocation> {
  const fallbackName = TRANSLATIONS[lang].search.currentLocationName;
  const fallbackCity: CityLocation = {
    id: `gps-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
    name: fallbackName,
    region: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    country: TRANSLATIONS[lang].search.gpsTelemetry,
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4500);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) return fallbackCity;

    const data = await res.json();
    const cityName =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      fallbackName;
    const region = data.principalSubdivision || data.locality || '';
    const country = data.countryName || '';

    return {
      id: `gps-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
      name: cityName,
      region: region === cityName ? '' : region,
      country,
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
    };
  } catch {
    return fallbackCity;
  }
}
