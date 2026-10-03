import React from 'react';
import { getStatusColor } from '../../../domain/risk/riskRules';
import { X, ShieldAlert, Navigation, Wind, Mountain, AlertCircle, Cpu } from 'lucide-react';

export function AssetDetailModal({
  asset,
  risk,
  onClose,
  onGenerateMitigation
}) {
  if (!asset || !risk) return null;

  const statusStyle = getStatusColor(risk.status);

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-700/80 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
              {asset.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded border ${statusStyle.badgeBg} ${statusStyle.badgeText} ${statusStyle.badgeBorder}`}
            >
              {risk.status} ({risk.riskScore}/100)
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-100 mt-1">
            {asset.name}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid of Key Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Distance
          </div>
          <div className="font-extrabold text-slate-100 text-sm mt-0.5">
            {risk.distanceKm} km
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-red-400" /> Wind Exposure
          </div>
          <div className="font-extrabold text-slate-100 text-sm mt-0.5">
            {risk.estimatedWindSpeed} km/h
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-amber-400" /> Elevation
          </div>
          <div className="font-extrabold text-slate-100 text-sm mt-0.5">
            {asset.elevation} m
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-purple-400" /> Base Vuln
          </div>
          <div className="font-extrabold text-slate-100 text-sm mt-0.5">
            {asset.vulnerability}%
          </div>
        </div>
      </div>

      {/* Risk Score Heuristic Breakdown */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Heuristic Formula Breakdown
        </h4>
        
        <div className="space-y-1.5 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400">
              <span>Proximity Risk (35%)</span>
              <span className="font-mono text-slate-200">{risk.breakdown?.distanceRisk || 0} / 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${risk.breakdown?.distanceRisk || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400">
              <span>Wind Hazard Risk (30%)</span>
              <span className="font-mono text-slate-200">{risk.breakdown?.windRisk || 0} / 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400"
                style={{ width: `${risk.breakdown?.windRisk || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400">
              <span>Elevation Exposure (15%)</span>
              <span className="font-mono text-slate-200">{risk.breakdown?.elevationRisk || 0} / 100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${risk.breakdown?.elevationRisk || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Risk Factors */}
      {asset.primaryRiskFactors && asset.primaryRiskFactors.length > 0 && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Vulnerability Threat Vectors:</span>
          <div className="flex flex-wrap gap-1.5">
            {asset.primaryRiskFactors.map((rf, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700"
              >
                {rf}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onGenerateMitigation(asset, risk)}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
      >
        <ShieldAlert className="w-4 h-4" /> Generate AI Emergency Mitigation Plan
      </button>
    </div>
  );
}
