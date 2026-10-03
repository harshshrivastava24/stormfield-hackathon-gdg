const { generateMitigationPlan } = require("../services/aiService");

async function handleGenerateMitigation(req, res) {
  try {
    const { asset, risk } = req.body;

    if (!asset || !asset.name) {
      return res.status(400).json({
        success: false,
        error: "Invalid request. 'asset' object is required."
      });
    }

    const plan = await generateMitigationPlan(asset, risk || {});

    return res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to generate mitigation plan",
      details: error.message
    });
  }
}

module.exports = {
  handleGenerateMitigation
};
