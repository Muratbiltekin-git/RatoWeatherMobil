import type { ThemeMode, WeatherConditionKind } from '../types/weather';

interface AmbientBackgroundProps {
  conditionKind: WeatherConditionKind;
  isDay: boolean;
  theme: ThemeMode;
}

export function AmbientBackground({ conditionKind, isDay, theme }: AmbientBackgroundProps) {
  const isLight = theme === 'light';

  const palette = (() => {
    if (isLight) {
      if (conditionKind === 'storm' || conditionKind === 'rain') {
        return {
          base: 'from-[#f1f6fc] via-[#e4eef9] to-[#d9e5f6]',
          orbA: 'radial-gradient(circle, rgba(14, 165, 233, 0.24) 0%, rgba(56, 189, 248, 0.08) 55%, transparent 75%)',
          orbB: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.06) 55%, transparent 75%)',
          orbC: 'radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(14, 165, 233, 0.05) 55%, transparent 75%)',
        };
      }
      if (conditionKind === 'clear-day' || (isDay && conditionKind === 'partly-cloudy')) {
        return {
          base: 'from-[#f8fbff] via-[#ecf4fd] to-[#e1ecfa]',
          orbA: 'radial-gradient(circle, rgba(56, 189, 248, 0.24) 0%, rgba(125, 211, 252, 0.08) 55%, transparent 75%)',
          orbB: 'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, rgba(253, 186, 116, 0.07) 55%, transparent 75%)',
          orbC: 'radial-gradient(circle, rgba(129, 140, 248, 0.16) 0%, rgba(56, 189, 248, 0.04) 55%, transparent 75%)',
        };
      }
      return {
        base: 'from-[#f5f8fd] via-[#e9f1fc] to-[#dde8f8]',
        orbA: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(56, 189, 248, 0.06) 55%, transparent 75%)',
        orbB: 'radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(99, 102, 241, 0.05) 55%, transparent 75%)',
        orbC: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.04) 55%, transparent 75%)',
      };
    }

    if (conditionKind === 'storm' || conditionKind === 'rain') {
      return {
        base: 'from-[#030712] via-[#071026] to-[#0d1430]',
        orbA: 'radial-gradient(circle, rgba(6, 182, 212, 0.24) 0%, rgba(14, 165, 233, 0.07) 55%, transparent 75%)',
        orbB: 'radial-gradient(circle, rgba(99, 102, 241, 0.24) 0%, rgba(139, 92, 246, 0.08) 55%, transparent 75%)',
        orbC: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.04) 55%, transparent 75%)',
      };
    }
    if (conditionKind === 'clear-day' || (isDay && conditionKind === 'partly-cloudy')) {
      return {
        base: 'from-[#04091a] via-[#0a142d] to-[#111c3a]',
        orbA: 'radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(56, 189, 248, 0.07) 55%, transparent 75%)',
        orbB: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(249, 115, 22, 0.05) 55%, transparent 75%)',
        orbC: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(59, 130, 246, 0.05) 55%, transparent 75%)',
      };
    }
    if (conditionKind === 'snow' || conditionKind === 'fog') {
      return {
        base: 'from-[#050b1c] via-[#0b152f] to-[#132042]',
        orbA: 'radial-gradient(circle, rgba(125, 211, 252, 0.22) 0%, rgba(56, 189, 248, 0.06) 55%, transparent 75%)',
        orbB: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, rgba(129, 140, 248, 0.05) 55%, transparent 75%)',
        orbC: 'radial-gradient(circle, rgba(45, 212, 191, 0.14) 0%, rgba(125, 211, 252, 0.04) 55%, transparent 75%)',
      };
    }
    return {
      base: 'from-[#040817] via-[#091229] to-[#0f1a38]',
      orbA: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(6, 182, 212, 0.06) 55%, transparent 75%)',
      orbB: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, rgba(99, 102, 241, 0.06) 55%, transparent 75%)',
      orbC: 'radial-gradient(circle, rgba(20, 184, 166, 0.16) 0%, rgba(14, 165, 233, 0.04) 55%, transparent 75%)',
    };
  })();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br ${palette.base} transition-colors duration-500`}
    >
      <div
        className="animate-aura-drift-a absolute -top-44 -left-28 h-[620px] w-[620px] rounded-full will-change-transform"
        style={{ background: palette.orbA }}
      />
      <div
        className="animate-aura-drift-b absolute top-[12%] -right-36 h-[580px] w-[580px] rounded-full will-change-transform"
        style={{ background: palette.orbB }}
      />
      <div
        className="animate-aura-drift-c absolute -bottom-44 left-[22%] h-[540px] w-[540px] rounded-full will-change-transform"
        style={{ background: palette.orbC }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.55),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.06),transparent_60%)]" />
    </div>
  );
}
