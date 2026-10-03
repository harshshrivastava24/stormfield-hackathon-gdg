import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, Wind, Gauge, Compass } from 'lucide-react';

export function TimelineControls({
  points = [],
  currentStep = 0,
  onStepChange,
  isPlaying,
  onTogglePlay,
  activeCyclonePoint
}) {
  const totalSteps = points.length;

  if (totalSteps === 0) return null;

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-700/60 shadow-xl space-y-4">
      {/* Upper readout header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Timeline Scrubbing & Simulation
            </div>
            <div className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{activeCyclonePoint?.timeLabel || `Step ${currentStep + 1}`}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                {activeCyclonePoint?.timestamp || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Storm Physics Telemetry */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
            <Wind className="w-4 h-4 text-red-400" />
            <div>
              <span className="text-slate-400">Wind: </span>
              <span className="font-bold text-slate-100">{activeCyclonePoint?.windSpeed || '--'} km/h</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
            <Gauge className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400">Pressure: </span>
              <span className="font-bold text-slate-100">{activeCyclonePoint?.pressure || '--'} hPa</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
            <Compass className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400">Status: </span>
              <span className="font-bold text-cyan-300">{activeCyclonePoint?.category || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Range Slider */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Time Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Play Simulation
              </>
            )}
          </button>

          <button
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep === totalSteps - 1}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Time Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full space-y-1">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Time Labels beneath slider */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
            {points.map((p, idx) => (
              <button
                key={`step-lbl-${idx}`}
                onClick={() => onStepChange(idx)}
                className={`hover:text-cyan-300 transition-colors ${
                  idx === currentStep ? 'text-cyan-400 font-bold underline' : ''
                }`}
              >
                {p.timeLabel.split(' ')[0]} {p.timeLabel.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
