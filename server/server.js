const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌀 StormShield Backend Server running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - GET  /api/cyclone?region=visakhapatnam`);
  console.log(`   - GET  /api/assets?region=visakhapatnam`);
  console.log(`   - POST /api/risk`);
  console.log(`   - POST /api/mitigation`);
  console.log(`==================================================`);
});
