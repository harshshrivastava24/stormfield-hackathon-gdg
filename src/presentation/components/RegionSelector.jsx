import React from 'react';
import { MapPin, AlertCircle, ShieldAlert } from 'lucide-react';

export function RegionSelector({ currentRegion, onRegionChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-slate-700/60 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ShieldAlert className="w-6 h-6 animate-pulse-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 tracking-wide">
              Target Coastal Region
            </h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Demonstration Data
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Simulated cyclone track & infrastructure vulnerability forecast
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
        <select
          value={currentRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full sm:w-64 bg-slate-900/90 text-slate-100 text-sm font-semibold border border-cyan-500/40 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer shadow-inner transition-all hover:border-cyan-400"
        >
          <option value="visakhapatnam">Visakhapatnam, Andhra Pradesh</option>
          <option value="puri">Puri, Odisha</option>
        </select>
      </div>
    </div>
  );
}
