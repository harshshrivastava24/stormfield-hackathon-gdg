const express = require("express");
const cors = require("cors");
const path = require("path");
const cycloneRoutes = require("./routes/cycloneRoutes");
const assetRoutes = require("./routes/assetRoutes");
const riskRoutes = require("./routes/riskRoutes");
const mitigationRoutes = require("./routes/mitigationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/cyclone", cycloneRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/mitigation", mitigationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "StormShield Backend API",
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build files in production if dist directory exists
const distPath = path.join(__dirname, "../dist");
if (require("fs").existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(distPath, "index.html"));
    }
  });
}

module.exports = app;
