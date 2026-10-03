const cycloneTracks = require("../data/cycloneTrack");

function getCycloneTrack(req, res) {
  try {
    const region = (req.query.region || "visakhapatnam").toLowerCase();
    const track = cycloneTracks[region] || cycloneTracks.visakhapatnam;
    
    return res.status(200).json({
      success: true,
      data: track
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch cyclone track data",
      details: error.message
    });
  }
}

module.exports = {
  getCycloneTrack
};
