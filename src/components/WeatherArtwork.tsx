import { useId } from 'react';
import type { WeatherConditionKind } from '../types/weather';

interface WeatherArtworkProps {
  kind: WeatherConditionKind;
  size?: number;
  className?: string;
}

export function WeatherArtwork({ kind, size = 32, className = '' }: WeatherArtworkProps) {
  const uid = useId().replace(/:/g, '');
  const sunGrad = `sun-${uid}`;
  const cloudGrad = `cloud-${uid}`;
  const moonGrad = `moon-${uid}`;
  const rainGrad = `rain-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_2px_6px_rgba(15,23,42,0.12)] dark:drop-shadow-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={sunGrad} x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={cloudGrad} x1="14" y1="22" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id={moonGrad} x1="18" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="55%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id={rainGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {kind === 'clear-day' && (
        <g>
          <circle cx="32" cy="32" r="22" fill={`url(#${sunGrad})`} fillOpacity="0.18" className="animate-aura-twinkle" />
          <circle cx="32" cy="32" r="14" fill={`url(#${sunGrad})`} />
          <g stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.9" className="animate-aura-spin-slow">
            <line x1="32" y1="7" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="57" />
            <line x1="7" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="57" y2="32" />
            <line x1="14.3" y1="14.3" x2="17.9" y2="17.9" />
            <line x1="46.1" y1="46.1" x2="49.7" y2="49.7" />
            <line x1="49.7" y1="14.3" x2="46.1" y2="17.9" />
            <line x1="17.9" y1="46.1" x2="14.3" y2="49.7" />
          </g>
        </g>
      )}

      {kind === 'clear-night' && (
        <g>
          <circle cx="32" cy="32" r="20" fill="#a855f7" fillOpacity="0.12" />
          <path
            d="M39.5 14.5C31.5 15.8 25.5 22.8 25.5 31.2C25.5 40.5 33.1 48 42.4 48C45.3 48 48 47.2 50.4 45.9C47.1 50.8 41.5 54 35.1 54C24.8 54 16.5 45.7 16.5 35.4C16.5 25.4 24.4 17.2 34.4 16.8C36.2 16.7 37.9 14.8 39.5 14.5Z"
            fill={`url(#${moonGrad})`}
            className="animate-aura-float"
          />
          <circle cx="48" cy="18" r="1.8" fill="#38bdf8" className="animate-aura-twinkle" />
          <circle cx="53" cy="28" r="1.2" fill="#c084fc" fillOpacity="0.85" className="animate-aura-twinkle" />
          <circle cx="20" cy="18" r="1.3" fill="#0284c7" fillOpacity="0.75" className="animate-aura-twinkle" />
        </g>
      )}

      {kind === 'partly-cloudy' && (
        <g>
          <circle cx="24" cy="23" r="10.5" fill={`url(#${sunGrad})`} />
          <circle cx="24" cy="23" r="15" fill="#fb923c" fillOpacity="0.18" className="animate-aura-twinkle" />
          <path
            d="M22 47H45.5C50.2 47 54 43.2 54 38.5C54 34 50.6 30.4 46.2 30C44.8 24.2 39.6 20 33.4 20C26.5 20 20.9 25.3 20.4 32.1C16.2 32.7 13 36.3 13 40.6C13 44.2 16 47 22 47Z"
            fill={`url(#${cloudGrad})`}
            className="animate-aura-float"
          />
        </g>
      )}

      {kind === 'cloudy' && (
        <g className="animate-aura-float">
          <path
            d="M22 39H46C49.9 39 53 35.9 53 32C53 28.4 50.3 25.4 46.8 25C45.7 19.9 41.2 16 35.8 16C29.8 16 24.9 20.6 24.4 26.5C20.7 27.1 18 30.3 18 34.1C18 36.8 19.8 39 22 39Z"
            fill="#64748b"
            fillOpacity="0.45"
          />
          <path
            d="M19 48H44.5C49.2 48 53 44.2 53 39.5C53 35 49.6 31.4 45.2 31C43.8 25.2 38.6 21 32.4 21C25.5 21 19.9 26.3 19.4 33.1C15.2 33.7 12 37.3 12 41.6C12 45.2 15 48 19 48Z"
            fill={`url(#${cloudGrad})`}
          />
        </g>
      )}

      {kind === 'fog' && (
        <g>
          <path
            d="M20 34H44.5C48.6 34 52 30.6 52 26.5C52 22.6 49 19.4 45.1 19C43.9 13.8 39.2 10 33.6 10C27.4 10 22.3 14.8 21.8 20.9C18 21.5 15 24.8 15 28.8C15 31.7 17.2 34 20 34Z"
            fill={`url(#${cloudGrad})`}
            fillOpacity="0.92"
            className="animate-aura-float"
          />
          <g stroke="#0284c7" strokeWidth="2.8" strokeLinecap="round" strokeOpacity="0.75">
            <line x1="13" y1="41" x2="51" y2="41" />
            <line x1="18" y1="47.5" x2="46" y2="47.5" strokeOpacity="0.58" />
            <line x1="23" y1="54" x2="41" y2="54" strokeOpacity="0.42" />
          </g>
        </g>
      )}

      {(kind === 'drizzle' || kind === 'rain') && (
        <g>
          <path
            d="M19 40H44.5C49.2 40 53 36.2 53 31.5C53 27 49.6 23.4 45.2 23C43.8 17.2 38.6 13 32.4 13C25.5 13 19.9 18.3 19.4 25.1C15.2 25.7 12 29.3 12 33.6C12 37.2 15 40 19 40Z"
            fill={`url(#${cloudGrad})`}
            className="animate-aura-float"
          />
          <g stroke={`url(#${rainGrad})`} strokeWidth="2.8" strokeLinecap="round" className="animate-aura-rain">
            <line x1="22" y1="45" x2="19" y2="54" />
            <line x1="32" y1="45" x2="29" y2="56" />
            <line x1="42" y1="45" x2="39" y2="54" />
          </g>
        </g>
      )}

      {kind === 'storm' && (
        <g>
          <path
            d="M19 39H44.5C49.2 39 53 35.2 53 30.5C53 26 49.6 22.4 45.2 22C43.8 16.2 38.6 12 32.4 12C25.5 12 19.9 17.3 19.4 24.1C15.2 24.7 12 28.3 12 32.6C12 36.2 15 39 19 39Z"
            fill={`url(#${cloudGrad})`}
            className="animate-aura-float"
          />
          <path d="M34 39L26 49H32.5L29.5 58L40 46.5H33.5L36.5 39H34Z" fill="#f59e0b" className="animate-aura-twinkle" />
          <line x1="20" y1="45" x2="17.5" y2="52" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" className="animate-aura-rain" />
          <line x1="44" y1="45" x2="41.5" y2="52" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" className="animate-aura-rain" />
        </g>
      )}

      {kind === 'snow' && (
        <g>
          <path
            d="M19 40H44.5C49.2 40 53 36.2 53 31.5C53 27 49.6 23.4 45.2 23C43.8 17.2 38.6 13 32.4 13C25.5 13 19.9 18.3 19.4 25.1C15.2 25.7 12 29.3 12 33.6C12 37.2 15 40 19 40Z"
            fill={`url(#${cloudGrad})`}
            className="animate-aura-float"
          />
          <g fill="#38bdf8" className="animate-aura-rain">
            <circle cx="21" cy="48" r="2.2" />
            <circle cx="32" cy="52" r="2.4" />
            <circle cx="43" cy="48" r="2.2" />
            <circle cx="26" cy="56" r="1.7" fillOpacity="0.75" />
            <circle cx="38" cy="56" r="1.7" fillOpacity="0.75" />
          </g>
        </g>
      )}
    </svg>
  );
}
