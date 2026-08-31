/**
 * ATM Loom AI — shared utility functions.
 * All number formatting is Indian locale (9,65,198 not 965,198).
 * All dates are in IST (Asia/Kolkata).
 */

/** Format a number in Indian locale with commas: 9,65,198 */
export function inr(value: number, decimals = 0): string {
  if (!isFinite(value)) return '—';
  // Use en-IN locale for Indian grouping
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format as Indian rupees: ₹9,65,198 */
export function rupee(value: number, decimals = 0): string {
  if (!isFinite(value)) return '—';
  return '₹' + inr(value, decimals);
}

/** Format as percentage with fixed decimals */
export function pct(value: number | null | undefined, decimals = 1): string {
  if (value == null || !isFinite(value)) return '—';
  return value.toFixed(decimals) + '%';
}

/** Format as signed percentage delta (+2.1% / -3.4%) */
export function deltaPct(value: number | null | undefined, decimals = 1): string {
  if (value == null || !isFinite(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(decimals) + '%';
}

/** Format date as DD Mon YYYY (e.g. 14 Aug 2026) */
export function fmtDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

/** Format datetime as "DD Mon, HH:MM" */
export function fmtDatetime(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }) + ', ' + date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

/** Format minutes as "Xh Ym" */
export function fmtMinutes(minutes: number): string {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Get today's date in YYYY-MM-DD format (IST) */
export function today(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/** Determine status class from efficiency % relative to target */
export function effStatus(effPct: number, targetPct: number): 'critical' | 'warn' | 'ok' {
  const gap = targetPct - effPct;
  if (gap > 10) return 'critical';
  if (gap > 5) return 'warn';
  return 'ok';
}

/** Status class from an arbitrary value that should be >= threshold */
export function thresholdStatus(value: number, targetMin: number): 'critical' | 'warn' | 'ok' {
  const ratio = value / targetMin;
  if (ratio < 0.90) return 'critical';
  if (ratio < 0.95) return 'warn';
  return 'ok';
}

/** Build a WhatsApp share text (≤6 lines) from morning brief data */
export function buildWhatsAppText(data: {
  date: string;
  efficiency: number;
  target: number;
  rupees_lost: number;
  top_issue: string;
  top_issue_loss: number;
  shifts: { s1: number; s2: number; s3: number };
  looms_stopped: number;
  max_downtime_loom: string;
  max_downtime_min: number;
  pm_overdue: string[];
}): string {
  const lines = [
    `ATM ${data.date} | Eff: ${pct(data.efficiency)} (Target ${pct(data.target)}) | Lost: ${rupee(data.rupees_lost)}`,
    `Top issue: ${data.top_issue} ${rupee(data.top_issue_loss)}`,
    `Shift 1: ${pct(data.shifts.s1)} | S2: ${pct(data.shifts.s2)} | S3: ${pct(data.shifts.s3)}`,
    `Looms stopped: ${data.looms_stopped} | Max: ${data.max_downtime_loom} (${fmtMinutes(data.max_downtime_min)})`,
    data.pm_overdue.length ? `PM overdue: ${data.pm_overdue.slice(0, 3).join(', ')}` : 'PM: All scheduled',
    `— Loom AI ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}`,
  ];
  return lines.join('\n');
}
