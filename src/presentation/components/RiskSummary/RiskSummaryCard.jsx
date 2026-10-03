import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity } from 'lucide-react';

export function RiskSummaryCard({ summary }) {
  const { total = 0, safe = 0, moderate = 0, critical = 0 } = summary || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Total Tracked Assets */}
      <div className="p-3.5 rounded-xl glass-panel border border-slate-700/60 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Assets Tracked
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">
            {total}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Safe Assets */}
      <div className="p-3.5 rounded-xl glass-panel border border-emerald-900/40 bg-emerald-950/20 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Safe Status
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1 font-mono">
            {safe}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Moderate Risk Assets */}
      <div className="p-3.5 rounded-xl glass-panel border border-amber-900/40 bg-amber-950/20 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Moderate Risk
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1 font-mono">
            {moderate}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Critical Risk Assets */}
      <div className="p-3.5 rounded-xl glass-panel border border-red-900/50 bg-red-950/30 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Critical Risk
          </div>
          <div className="text-2xl font-extrabold text-red-400 mt-1 font-mono animate-pulse">
            {critical}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertOctagon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
