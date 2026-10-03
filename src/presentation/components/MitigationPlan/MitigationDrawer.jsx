import React from 'react';
import { X, ShieldCheck, AlertTriangle, Cpu, CheckCircle2, Copy, Download, RefreshCw, FileText } from 'lucide-react';

export function MitigationDrawer({
  isOpen,
  onClose,
  asset,
  risk,
  plan,
  isGenerating,
  onRegenerate
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!plan) return;
    const content = `STORM SHIELD MITIGATION PLAN
Asset: ${asset?.name || 'N/A'}
Priority: ${plan.priority}
Summary: ${plan.summary}
Actions:
${plan.actions?.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-700/80 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm">
                AI Emergency Mitigation Plan
              </h3>
              <p className="text-[11px] text-slate-400">
                Actionable response steps for facility protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Target Facility Context Card */}
          {asset && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 uppercase">
                  {asset.category}
                </span>
                <span className="text-[11px] font-bold text-slate-300">
                  Elevation: {asset.elevation}m
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-100">
                {asset.name}
              </h4>
              {risk && (
                <div className="flex items-center gap-3 text-xs pt-1 border-t border-slate-850">
                  <span className="text-slate-400">
                    Risk Score: <strong className="text-red-400">{risk.riskScore}/100</strong>
                  </span>
                  <span className="text-slate-400">
                    Wind Exp: <strong className="text-amber-300">{risk.estimatedWindSpeed} km/h</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {isGenerating ? (
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center gap-3 text-cyan-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-sm font-bold animate-pulse">
                  Synthesizing Mitigation Strategies...
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          ) : plan ? (
            <>
              {/* Priority & Source Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Priority Level:</span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-red-950 text-red-400 border border-red-500/40">
                    {plan.priority || 'HIGH'}
                  </span>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  Engine: {plan.source || 'gemini-api'}
                </span>
              </div>

              {/* Summary Statement */}
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                <strong className="block text-cyan-400 mb-1">Impact Overview:</strong>
                {plan.summary}
              </div>

              {/* Action Checklist */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Recommended Disaster Action Steps
                </h5>

                <div className="space-y-2">
                  {plan.actions && plan.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate Plan
          </button>

          <button
            onClick={handleCopy}
            disabled={!plan || isGenerating}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied to Clipboard!' : 'Copy Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
