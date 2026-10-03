const { calculateHaversineDistance } = require("../utils/haversine");

function calculateDistanceRisk(distanceKm) {
  if (distanceKm <= 25) return 100;
  if (distanceKm <= 50) return 75;
  if (distanceKm <= 100) return 50;
  if (distanceKm <= 200) return 25;
  return 5;
}

function calculateWindRisk(windSpeed) {
  if (windSpeed < 60) return 20;
  if (windSpeed <= 90) return 40;
  if (windSpeed <= 120) return 65;
  if (windSpeed <= 150) return 85;
  return 100;
}

function calculateElevationRisk(elevationMeters) {
  if (elevationMeters <= 3) return 100;
  if (elevationMeters <= 7) return 75;
  if (elevationMeters <= 15) return 40;
  return 15;
}

function calculateSingleAssetRisk(asset, cyclone) {
  const distanceKm = calculateHaversineDistance(
    cyclone.lat,
    cyclone.lng,
    asset.lat,
    asset.lng
  );

  // Estimate local wind speed experienced by asset based on distance from cyclone eye
  const distanceFactor = Math.max(0.15, Math.pow(Math.max(0, 1 - distanceKm / 220), 1.2));
  const estimatedWindSpeed = Math.round(cyclone.windSpeed * distanceFactor);

  const distanceRisk = calculateDistanceRisk(distanceKm);
  const windRisk = calculateWindRisk(cyclone.windSpeed);
  const elevationRisk = calculateElevationRisk(asset.elevation || 5);
  const vulnerabilityRisk = asset.vulnerability || 50;

  const rawRiskScore =
    distanceRisk * 0.35 +
    windRisk * 0.30 +
    elevationRisk * 0.15 +
    vulnerabilityRisk * 0.20;

  const riskScore = Math.min(100, Math.max(0, Math.round(rawRiskScore)));

  let status = "SAFE";
  if (riskScore >= 70) {
    status = "CRITICAL";
  } else if (riskScore >= 40) {
    status = "MODERATE";
  }

  return {
    assetId: asset.id,
    assetName: asset.name,
    category: asset.category,
    region: asset.region,
    lat: asset.lat,
    lng: asset.lng,
    elevation: asset.elevation,
    vulnerability: asset.vulnerability,
    distanceKm,
    estimatedWindSpeed,
    riskScore,
    status,
    breakdown: {
      distanceRisk,
      windRisk,
      elevationRisk,
      vulnerabilityRisk
    }
  };
}

function calculateAllAssetsRisk(assets, cyclone) {
  return assets.map((asset) => calculateSingleAssetRisk(asset, cyclone));
}

module.exports = {
  calculateSingleAssetRisk,
  calculateAllAssetsRisk
};
