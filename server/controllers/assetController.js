const assetsData = require("../data/assets");

function getAssets(req, res) {
  try {
    const region = (req.query.region || "visakhapatnam").toLowerCase();
    const assets = assetsData[region] || assetsData.visakhapatnam;

    return res.status(200).json({
      success: true,
      count: assets.length,
      region,
      data: assets
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch infrastructure assets",
      details: error.message
    });
  }
}

module.exports = {
  getAssets
};
