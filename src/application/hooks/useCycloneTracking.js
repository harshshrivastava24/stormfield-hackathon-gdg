import { useState, useEffect, useCallback } from 'react';
import { cycloneRepository } from '../../infrastructure/repositories/cycloneRepository';
import { assetRepository } from '../../infrastructure/repositories/assetRepository';
import { calculateAssetRisk } from '../useCases/calculateAssetRisk';
import { generateMitigationPlan } from '../useCases/generateMitigationPlan';

export function useCycloneTracking(initialRegion = 'visakhapatnam') {
  const [region, setRegion] = useState(initialRegion);
  const [cycloneTrack, setCycloneTrack] = useState(null);
  const [assets, setAssets] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState({ summary: { total: 0, safe: 0, moderate: 0, critical: 0 }, data: [] });

  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [mitigationAsset, setMitigationAsset] = useState(null);
  const [mitigationRisk, setMitigationRisk] = useState(null);
  const [mitigationPlan, setMitigationPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cyclone track and assets when region changes
  useEffect(() => {
    let isMounted = true;
    async function loadRegionData() {
      setLoading(true);
      setIsPlaying(false);
      setCurrentStep(0);
      setSelectedAssetId(null);
      setMitigationAsset(null);
      setMitigationRisk(null);
      setMitigationPlan(null);

      try {
        const [track, rawAssets] = await Promise.all([
          cycloneRepository.getCycloneTrack(region),
          assetRepository.getAssetsByRegion(region)
        ]);

        if (isMounted) {
          setCycloneTrack(track);
          setAssets(rawAssets);
        }
      } catch (err) {
        console.error('Failed to load region data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRegionData();
    return () => {
      isMounted = false;
    };
  }, [region]);

  // Recalculate risk whenever currentStep, cycloneTrack, or assets change
  const evaluateRisk = useCallback(async () => {
    if (!cycloneTrack || !cycloneTrack.points || cycloneTrack.points.length === 0 || assets.length === 0) {
      return;
    }
    const currentCyclonePos = cycloneTrack.points[currentStep] || cycloneTrack.points[0];
    const riskResult = await calculateAssetRisk(currentCyclonePos, region, assets);
    setRiskData(riskResult);
  }, [cycloneTrack, currentStep, assets, region]);

  useEffect(() => {
    evaluateRisk();
  }, [evaluateRisk]);

  // Auto playback interval timer
  useEffect(() => {
    let interval = null;
    if (isPlaying && cycloneTrack && cycloneTrack.points) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= cycloneTrack.points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, cycloneTrack]);

  // Current cyclone point
  const activeCyclonePoint = cycloneTrack?.points?.[currentStep] || null;

  // Selected asset risk object
  const selectedAssetRisk = riskData?.data?.find((r) => r.assetId === selectedAssetId) || null;
  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || null;

  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
  };

  const handleGenerateMitigation = async (asset, risk) => {
    const targetAsset = asset || mitigationAsset || selectedAsset;
    const targetRisk = risk || mitigationRisk || selectedAssetRisk;

    if (!targetAsset) {
      console.warn('No target asset found for mitigation generation');
      return;
    }

    setMitigationAsset(targetAsset);
    setMitigationRisk(targetRisk);

    setMitigationPlan(null);
    setIsGeneratingPlan(true);
    setIsDrawerOpen(true);
    try {
      const plan = await generateMitigationPlan(targetAsset, targetRisk);
      setMitigationPlan(plan);
    } catch (err) {
      console.error('Failed to generate mitigation plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return {
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
    selectAsset: handleSelectAsset,
    mitigationAsset,
    mitigationRisk,
    mitigationPlan,
    isGeneratingPlan,
    isDrawerOpen,
    setIsDrawerOpen,
    generateMitigation: handleGenerateMitigation
  };
}
