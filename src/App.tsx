/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LocateFixed, X } from 'lucide-react';
import { TRANSLATIONS } from './i18n/translations';
import type {
  CityLocation,
  CitySummary,
  Language,
  ScreenView,
  TemperatureUnit,
  ThemeMode,
  WeatherBundle,
} from './types/weather';
import {
  DEFAULT_CITIES,
  fetchCitySummaries,
  fetchWeatherForCity,
  reverseGeocodeCity,
} from './services/weatherApi';
import { AmbientBackground } from './components/AmbientBackground';
import { TopNav } from './components/TopNav';
import { MobileDock } from './components/MobileDock';
import { LocationSearchModal } from './components/LocationSearchModal';
import { ForecastScreen } from './components/ForecastScreen';
import { RadarScreen } from './components/RadarScreen';
import { AtmosphereScreen } from './components/AtmosphereScreen';
import { LocationsScreen } from './components/LocationsScreen';

const STORAGE_CITIES_KEY = 'aura_weather_saved_cities_v1';
const STORAGE_ACTIVE_CITY_KEY = 'aura_weather_active_city_v1';
const STORAGE_UNIT_KEY = 'aura_weather_unit_v1';
const STORAGE_LANG_KEY = 'aura_weather_lang_v1';
const STORAGE_THEME_KEY = 'aura_weather_theme_v1';

function loadSavedCities(): CityLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_CITIES_KEY);
    if (!raw) return DEFAULT_CITIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_CITIES;
  } catch {
    return DEFAULT_CITIES;
  }
}

function loadActiveCity(saved: CityLocation[]): CityLocation {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_CITY_KEY);
    if (!raw) return saved[0] ?? DEFAULT_CITIES[0];
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.latitude === 'number') return parsed;
    return saved[0] ?? DEFAULT_CITIES[0];
  } catch {
    return saved[0] ?? DEFAULT_CITIES[0];
  }
}

function loadUnit(): TemperatureUnit {
  try {
    const val = localStorage.getItem(STORAGE_UNIT_KEY);
    return val === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

function loadLang(): Language {
  try {
    const val = localStorage.getItem(STORAGE_LANG_KEY);
    if (val === 'tr' || val === 'en') return val;
    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('tr')) {
      return 'tr';
    }
    return 'tr';
  } catch {
    return 'tr';
  }
}

function loadTheme(): ThemeMode {
  try {
    const val = localStorage.getItem(STORAGE_THEME_KEY);
    if (val === 'light' || val === 'dark') return val;
    return 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  const [savedCities, setSavedCities] = useState<CityLocation[]>(loadSavedCities);
  const [activeCity, setActiveCity] = useState<CityLocation>(() => loadActiveCity(loadSavedCities()));
  const [unit, setUnit] = useState<TemperatureUnit>(loadUnit);
  const [lang, setLang] = useState<Language>(loadLang);
  const [theme, setTheme] = useState<ThemeMode>(loadTheme);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('forecast');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [citySummaries, setCitySummaries] = useState<CitySummary[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);

  const [geoStatus, setGeoStatus] = useState<'idle' | 'detecting' | 'prompt' | 'denied' | 'resolved'>('idle');
  const [isGeoPromptDismissed, setIsGeoPromptDismissed] = useState(false);

  const requestUserLocation = useCallback(
    (currentLang: Language) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setGeoStatus('denied');
        return;
      }
      setGeoStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const localCity = await reverseGeocodeCity(
            pos.coords.latitude,
            pos.coords.longitude,
            currentLang
          );
          setActiveCity(localCity);
          setSavedCities((prev) => {
            const withoutSameGps = prev.filter((c) => !c.id.startsWith('gps-'));
            return [localCity, ...withoutSameGps].slice(0, 12);
          });
          setGeoStatus('resolved');
        },
        (err) => {
          setGeoStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'prompt');
        },
        { enableHighAccuracy: false, timeout: 7000, maximumAge: 300_000 }
      );
    },
    []
  );

  // Request user location automatically on first app entry
  useEffect(() => {
    requestUserLocation(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWeather = useCallback(async (city: CityLocation, language: Language, refreshOnly = false) => {
    if (refreshOnly) {
      setIsRefreshing(true);
    } else {
      setIsLoadingWeather(true);
    }
    const data = await fetchWeatherForCity(city, language);
    setBundle(data);
    setIsLoadingWeather(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    void loadWeather(activeCity, lang, false);
  }, [activeCity, lang, loadWeather]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CITIES_KEY, JSON.stringify(savedCities));
    } catch {
      // ignore storage quota errors
    }
  }, [savedCities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_CITY_KEY, JSON.stringify(activeCity));
    } catch {
      // ignore
    }
  }, [activeCity]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UNIT_KEY, unit);
    } catch {
      // ignore
    }
  }, [unit]);

  useEffect(() => {
    if (activeScreen !== 'locations') return;
    let cancelled = false;
    setIsLoadingSummaries(true);
    fetchCitySummaries(savedCities, lang).then((list) => {
      if (!cancelled) {
        setCitySummaries(list);
        setIsLoadingSummaries(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeScreen, savedCities, lang]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setActiveCity(city);
    setSavedCities((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      return [city, ...prev].slice(0, 12);
    });
    if (activeScreen === 'locations') {
      setActiveScreen('forecast');
    }
  };

  const handleToggleSaveCity = (city: CityLocation) => {
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.id === city.id);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c.id !== city.id);
      }
      return [...prev, city];
    });
  };

  const handleRemoveCity = (cityId: string) => {
    setSavedCities((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((c) => c.id !== cityId);
      if (activeCity.id === cityId && next[0]) {
        setActiveCity(next[0]);
      }
      return next;
    });
  };

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-[#dbe1ff]">
      <AmbientBackground
        conditionKind={bundle?.current.conditionKind ?? 'partly-cloudy'}
        isDay={bundle?.current.isDay ?? true}
        theme={theme}
      />

      <TopNav
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onOpenSearch={() => setIsSearchOpen(true)}
        lang={lang}
      />

      <main className="mx-auto max-w-[1280px] px-4 pb-28 pt-6 sm:px-6 md:pb-12 lg:px-10 lg:pt-8">
        {!isGeoPromptDismissed && geoStatus !== 'resolved' && geoStatus !== 'idle' && (
          <section
            aria-label={TRANSLATIONS[lang].locationPrompt.requestTitle}
            className="glass-l2 mb-5 flex flex-col gap-3 rounded-2xl border-[#0284c7]/30 px-4 py-3.5 dark:border-[#4cd6fb]/35 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#0284c7]/30 bg-[#0284c7]/10 text-[#0284c7] dark:border-[#4cd6fb]/35 dark:bg-[#4cd6fb]/15 dark:text-[#4cd6fb]">
                <LocateFixed
                  className={`h-4 w-4 ${geoStatus === 'detecting' ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {geoStatus === 'detecting'
                    ? TRANSLATIONS[lang].locationPrompt.detectingTitle
                    : TRANSLATIONS[lang].locationPrompt.requestTitle}
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-[#bcc9ce]">
                  {geoStatus === 'detecting'
                    ? TRANSLATIONS[lang].locationPrompt.detectingSubtitle
                    : geoStatus === 'denied'
                      ? TRANSLATIONS[lang].locationPrompt.deniedSubtitle
                      : TRANSLATIONS[lang].locationPrompt.requestSubtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {geoStatus !== 'detecting' && (
                <button
                  type="button"
                  onClick={() => requestUserLocation(lang)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,180,216,0.35)] transition-transform hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
                >
                  <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{TRANSLATIONS[lang].locationPrompt.allowButton}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsGeoPromptDismissed(true)}
                aria-label={TRANSLATIONS[lang].locationPrompt.dismissButton}
                className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-slate-900/12 bg-white/75 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.06] dark:text-[#bcc9ce] dark:hover:bg-white/[0.12] dark:hover:text-white whitespace-nowrap"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{TRANSLATIONS[lang].locationPrompt.dismissButton}</span>
              </button>
            </div>
          </section>
        )}

        {isLoadingWeather && !bundle ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="glass-l1 h-[460px] animate-pulse rounded-3xl lg:col-span-4" />
            <div className="space-y-6 lg:col-span-8">
              <div className="glass-l1 h-56 animate-pulse rounded-3xl" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="glass-l1 h-40 animate-pulse rounded-2xl" />
                <div className="glass-l1 h-40 animate-pulse rounded-2xl" />
                <div className="glass-l1 h-40 animate-pulse rounded-2xl" />
              </div>
              <div className="glass-l1 h-72 animate-pulse rounded-3xl" />
            </div>
          </div>
        ) : bundle ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeScreen}-${bundle.location.id}-${lang}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeScreen === 'forecast' && (
                <ForecastScreen
                  bundle={bundle}
                  unit={unit}
                  lang={lang}
                  theme={theme}
                  savedCities={savedCities}
                  onSelectCity={handleSelectCity}
                  onRefresh={() => void loadWeather(activeCity, lang, true)}
                  isRefreshing={isRefreshing}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'radar' && (
                <RadarScreen
                  bundle={bundle}
                  unit={unit}
                  lang={lang}
                  theme={theme}
                />
              )}

              {activeScreen === 'atmosphere' && (
                <AtmosphereScreen
                  bundle={bundle}
                  unit={unit}
                  lang={lang}
                  theme={theme}
                />
              )}

              {activeScreen === 'locations' && (
                <LocationsScreen
                  summaries={citySummaries}
                  activeCityId={activeCity.id}
                  unit={unit}
                  onChangeUnit={setUnit}
                  lang={lang}
                  onChangeLang={setLang}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                  isLoading={isLoadingSummaries}
                  onSelectCity={handleSelectCity}
                  onRemoveCity={handleRemoveCity}
                  onOpenSearch={() => setIsSearchOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </main>

      <MobileDock activeScreen={activeScreen} onSelectScreen={setActiveScreen} lang={lang} />

      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        savedCities={savedCities}
        activeCityId={activeCity.id}
        onSelectCity={handleSelectCity}
        onToggleSaveCity={handleToggleSaveCity}
        lang={lang}
      />
    </div>
  );
}
