export const RISK_THRESHOLDS = {
  SAFE_MAX: 39,
  MODERATE_MAX: 69,
  CRITICAL_MIN: 70
};

export const RISK_STATUS = {
  SAFE: 'SAFE',
  MODERATE: 'MODERATE',
  CRITICAL: 'CRITICAL'
};

export const WEIGHTS = {
  DISTANCE: 0.35,
  WIND: 0.30,
  ELEVATION: 0.15,
  VULNERABILITY: 0.20
};

export function getStatusColor(status) {
  switch (status) {
    case RISK_STATUS.CRITICAL:
      return {
        badgeBg: 'bg-red-950/80',
        badgeText: 'text-red-400',
        badgeBorder: 'border-red-500/40',
        hex: '#EF4444',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]'
      };
    case RISK_STATUS.MODERATE:
      return {
        badgeBg: 'bg-amber-950/80',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/40',
        hex: '#F59E0B',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]'
      };
    case RISK_STATUS.SAFE:
    default:
      return {
        badgeBg: 'bg-emerald-950/80',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/40',
        hex: '#10B981',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]'
      };
  }
}
