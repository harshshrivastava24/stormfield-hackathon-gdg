import apiClient from '../../infrastructure/api/apiClient';

/**
 * Calculates asset risk using backend API with local fallback
 */
export async function calculateAssetRisk(cyclonePosition, region, assets) {
  try {
    const response = await apiClient.post('/risk', {
      cyclone: cyclonePosition,
      region,
      assets
    });
    return response.data;
  } catch (error) {
    console.warn('Risk API endpoint unavailable, evaluating client-side fallback:', error.message);
    return computeClientSideRisk(cyclonePosition, assets);
  }
}

function computeClientSideRisk(cyclone, assets) {
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  const results = assets.map((asset) => {
    const dist = haversine(cyclone.lat, cyclone.lng, asset.lat, asset.lng);
    const distFactor = Math.max(0.15, Math.pow(Math.max(0, 1 - dist / 220), 1.2));
    const estimatedWindSpeed = Math.round(cyclone.windSpeed * distFactor);

    let dRisk = 5;
    if (dist <= 25) dRisk = 100;
    else if (dist <= 50) dRisk = 75;
    else if (dist <= 100) dRisk = 50;
    else if (dist <= 200) dRisk = 25;

    let wRisk = 20;
    if (cyclone.windSpeed > 150) wRisk = 100;
    else if (cyclone.windSpeed >= 120) wRisk = 85;
    else if (cyclone.windSpeed >= 90) wRisk = 65;
    else if (cyclone.windSpeed >= 60) wRisk = 40;

    let eRisk = 15;
    if (asset.elevation <= 3) eRisk = 100;
    else if (asset.elevation <= 7) eRisk = 75;
    else if (asset.elevation <= 15) eRisk = 40;

    const vRisk = asset.vulnerability || 50;

    const score = Math.round(dRisk * 0.35 + wRisk * 0.30 + eRisk * 0.15 + vRisk * 0.20);
    let status = 'SAFE';
    if (score >= 70) status = 'CRITICAL';
    else if (score >= 40) status = 'MODERATE';

    return {
      assetId: asset.id,
      assetName: asset.name,
      category: asset.category,
      lat: asset.lat,
      lng: asset.lng,
      elevation: asset.elevation,
      vulnerability: asset.vulnerability,
      distanceKm: dist,
      estimatedWindSpeed,
      riskScore: score,
      status
    };
  });

  return {
    success: true,
    summary: {
      total: results.length,
      safe: results.filter((r) => r.status === 'SAFE').length,
      moderate: results.filter((r) => r.status === 'MODERATE').length,
      critical: results.filter((r) => r.status === 'CRITICAL').length
    },
    data: results
  };
}
