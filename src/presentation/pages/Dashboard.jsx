import React from 'react';
import { useCycloneTracking } from '../../application/hooks/useCycloneTracking';
import { RegionSelector } from '../components/RegionSelector';
import { CycloneMap } from '../components/Map/CycloneMap';
import { TimelineControls } from '../components/Timeline/TimelineControls';
import { RiskSummaryCard } from '../components/RiskSummary/RiskSummaryCard';
import { AssetList } from '../components/AssetPanel/AssetList';
import { AssetDetailModal } from '../components/AssetPanel/AssetDetailModal';
import { MitigationDrawer } from '../components/MitigationPlan/MitigationDrawer';
import { Shield, Wind, Radio, AlertOctagon } from 'lucide-react';

export function Dashboard() {
  const {
    region,
    setRegion,
    cycloneTrack,
    assets,
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    loading,
    riskData,
    activeCyclonePoint,
    selectedAssetId,
    selectedAsset,
    selectedAssetRisk,
    selectAsset,
    mitigationAsset,
    mitigationRisk,
    mitigationPlan,
    isGeneratingPlan,
    isDrawerOpen,
    setIsDrawerOpen,
    generateMitigation
  } = useCycloneTracking('visakhapatnam');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-10">
      {/* Top Application Header */}
      <header className="sticky top-0 z-[2000] bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-slate-950 font-black">
              <Shield className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-outfit">
                  StormShield
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  PoC v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Cyclone Impact & Infrastructure Vulnerability Forecast System
              </p>
            </div>
          </div>

          {/* Right Header Status Telemetry */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">System Telemetry:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-900/60 text-red-300 font-bold">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>{activeCyclonePoint?.category || 'Storm Alert'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* Region Selector */}
        <RegionSelector
          currentRegion={region}
          onRegionChange={setRegion}
        />

        {/* Risk Counter Summary Card */}
        <RiskSummaryCard summary={riskData.summary} />

        {/* Main Grid: Map & Controls (Left 7 cols) + Asset List / Detail (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Leaflet Map & Timeline Controls */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Leaflet Map */}
            <CycloneMap
              cycloneTrack={cycloneTrack}
              currentStep={currentStep}
              riskData={riskData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={selectAsset}
              onGenerateMitigation={(item) => generateMitigation(item)}
            />

            {/* Timeline & Playback Slider */}
            <TimelineControls
              points={cycloneTrack?.points || []}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              activeCyclonePoint={activeCyclonePoint}
            />
          </div>

          {/* Right Column: Asset List & Selected Detail Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Selected Asset Details Panel (When asset is clicked) */}
            {selectedAsset && selectedAssetRisk && (
              <AssetDetailModal
                asset={selectedAsset}
                risk={selectedAssetRisk}
                onClose={() => selectAsset(null)}
                onGenerateMitigation={(a, r) => generateMitigation(a, r)}
              />
            )}

            {/* Filterable Infrastructure Asset List */}
            <AssetList
              assets={assets}
              riskData={riskData.data}
              selectedAssetId={selectedAssetId}
              onSelectAsset={selectAsset}
              onGenerateMitigation={(a, r) => generateMitigation(a, r)}
            />
          </div>
        </div>
      </main>

      {/* AI Mitigation Side Drawer Overlay */}
      <MitigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        asset={mitigationAsset || selectedAsset}
        risk={mitigationRisk || selectedAssetRisk}
        plan={mitigationPlan}
        isGenerating={isGeneratingPlan}
        onRegenerate={() => generateMitigation()}
      />
    </div>
  );
}
