import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin, Plus, Search, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { CityLocation, Language } from '../types/weather';
import { DEFAULT_CITIES, reverseGeocodeCity, searchCities } from '../services/weatherApi';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: CityLocation[];
  activeCityId: string;
  onSelectCity: (city: CityLocation) => void;
  onToggleSaveCity: (city: CityLocation) => void;
  lang: Language;
}

export function LocationSearchModal({
  isOpen,
  onClose,
  savedCities,
  activeCityId,
  onSelectCity,
  onToggleSaveCity,
  lang,
}: LocationSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[lang].search;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setGeoError(null);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      const hits = await searchCities(trimmed, lang);
      if (!cancelled) {
        setResults(hits);
        setIsSearching(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query, lang]);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError(t.geoUnavailable);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const localCity = await reverseGeocodeCity(
          pos.coords.latitude,
          pos.coords.longitude,
          lang
        );
        onSelectCity(localCity);
        onClose();
      },
      () => {
        setGeoError(t.geoDenied);
      },
      { timeout: 6000 }
    );
  };

  const displayList = query.trim().length >= 2 ? results : DEFAULT_CITIES;
  const savedIds = new Set(savedCities.map((c) => c.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogLabel}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-16 backdrop-blur-md dark:bg-[#050d25]/70 sm:pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-l2 w-full max-w-xl overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3 border-b border-slate-900/10 px-5 py-4 dark:border-white/10">
          <Search className="h-5 w-5 shrink-0 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-[#869398]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeAria}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-900/10 hover:text-slate-900 dark:text-[#bcc9ce] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 aura-scroll">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-[#94a3b8]">
              {query.trim().length >= 2 ? t.globalResults : t.featuredDestinations}
            </span>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-slate-900/12 bg-slate-900/[0.04] px-3 py-1 text-xs font-medium text-[#0284c7] transition-colors hover:bg-slate-900/[0.08] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#4cd6fb] dark:hover:bg-white/[0.12]"
            >
              <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.useCurrentLocation}</span>
            </button>
          </div>

          {geoError && (
            <p className="mb-3 rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-[#ffb4ab]/30 dark:bg-[#93000a]/40 dark:text-[#ffdad6]">
              {geoError}
            </p>
          )}

          {isSearching ? (
            <div className="space-y-2 py-2">
              {[0, 1, 2].map((n) => (
                <div key={n} className="h-14 animate-pulse rounded-2xl bg-slate-900/[0.05] dark:bg-white/[0.05]" />
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-600 dark:text-[#bcc9ce]">
              {t.noResults(query)}
            </div>
          ) : (
            <ul className="space-y-1.5">
              {displayList.map((city) => {
                const isSelected = city.id === activeCityId;
                const isSaved = savedIds.has(city.id);
                return (
                  <li key={city.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className={`flex min-h-[52px] flex-1 items-center justify-between rounded-2xl px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'border border-[#0284c7]/40 bg-[#0284c7]/10 text-slate-900 dark:border-[#4cd6fb]/40 dark:bg-[#4cd6fb]/12 dark:text-white'
                          : 'border border-transparent text-slate-700 hover:bg-slate-900/[0.05] dark:text-[#dbe1ff] dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MapPin className="h-4 w-4 shrink-0 text-[#0284c7] dark:text-[#4cd6fb]" aria-hidden="true" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{city.name}</div>
                          <div className="truncate text-xs text-slate-500 dark:text-[#94a3b8]">
                            {[city.region, city.country].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-[#869398] tabular-nums shrink-0 ml-3">
                        {city.latitude.toFixed(1)}°, {city.longitude.toFixed(1)}°
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSaveCity(city)}
                      aria-label={isSaved ? t.unpinCity(city.name) : t.pinCity(city.name)}
                      className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors ${
                        isSaved
                          ? 'border-[#0284c7]/40 bg-[#0284c7]/12 text-[#0284c7] dark:border-[#4cd6fb]/40 dark:bg-[#4cd6fb]/15 dark:text-[#4cd6fb]'
                          : 'border-slate-900/10 bg-slate-900/[0.03] text-slate-500 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#94a3b8] dark:hover:text-white'
                      }`}
                    >
                      <Plus className={`h-4 w-4 transition-transform ${isSaved ? 'rotate-45' : ''}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
