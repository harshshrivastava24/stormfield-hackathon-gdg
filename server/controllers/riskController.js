const assetsData = require("../data/assets");
const { calculateAllAssetsRisk } = require("../services/riskService");

function calculateRisk(req, res) {
  try {
    const { cyclone, region = "visakhapatnam", assets: customAssets } = req.body;

    if (!cyclone || typeof cyclone.lat !== "number" || typeof cyclone.lng !== "number") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'cyclone' object with lat, lng, and windSpeed"
      });
    }

    const regionKey = region.toLowerCase();
    const assets = customAssets || assetsData[regionKey] || assetsData.visakhapatnam;

    const riskResults = calculateAllAssetsRisk(assets, cyclone);

    const summary = {
      total: riskResults.length,
      safe: riskResults.filter((r) => r.status === "SAFE").length,
      moderate: riskResults.filter((r) => r.status === "MODERATE").length,
      critical: riskResults.filter((r) => r.status === "CRITICAL").length
    };

    return res.status(200).json({
      success: true,
      summary,
      cyclonePosition: cyclone,
      data: riskResults
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error processing risk calculations",
      details: error.message
    });
  }
}

module.exports = {
  calculateRisk
};
