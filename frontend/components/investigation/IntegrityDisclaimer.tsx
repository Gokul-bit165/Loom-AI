import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface IntegrityDisclaimerProps {
  reason?: string;
}

export function IntegrityDisclaimer({
  reason = 'Factory shift registers record actual production volume and realized commercial style rates. Computing an exact commercial monetary loss requires contracted price books, committed customer delivery penalties, and variable yarn/power margin profiles per loom. To preserve 100% data trust, Loom AI refuses to fabricate or simulate unverified loss numbers.',
}: IntegrityDisclaimerProps) {
  return (
    <div className="panel-command border-command-700/80 bg-command-900/60 p-4 space-y-2 font-mono text-xs">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
        <span className="font-bold text-command-100 uppercase tracking-wider text-[11px]">
          COMMERCIAL REVENUE LOSS POLICY & DATA INTEGRITY
        </span>
        <span className="badge-mono bg-command-800 text-command-400 border border-command-700">
          revenue_loss_available = false
        </span>
      </div>
      <p className="text-command-400 text-[11px] leading-relaxed pl-6">
        {reason}
      </p>
    </div>
  );
}
