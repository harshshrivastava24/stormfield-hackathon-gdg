const dotenv = require("dotenv");
dotenv.config();

let generationCounter = 1;

/**
 * Multiple distinct operational strategy profiles for fallback mitigation planning.
 * Rotating through strategies guarantees a 100% visually distinct plan on every 'Regenerate' click!
 */
const STRATEGY_PROFILES = [
  {
    mode: "STRUCTURAL HARDENING & SURGE DEFENSE",
    summaryPrefix: "Strategy Focus Alpha (Structural & Surge Isolation): Priority centered on physical barrier deployment, crane/equipment anchoring, and saltwater inundation prevention.",
    getActions: (name, cat, wind, dist, elev) => [
      `Deploy mobile flood barriers and heavy sandbags around ground-level entrances at ${name} (elevation ${elev}m).`,
      `Inspect and fortify primary anchor cables against sustained peak wind gusts of ${wind} km/h.`,
      `Seal external ventilation ducts, sluice doors, and cable entry trenches against high-tide storm surge.`,
      `Moor heavy vessels and mobile equipment in reinforced sheltered bays away from open quay edges.`,
      `Establish high-ground observation point to monitor structural integrity during storm peak.`
    ]
  },
  {
    mode: "ELECTRICAL GRID & UTILITY SAFEGUARDS",
    summaryPrefix: "Strategy Focus Beta (Utilities & Energy Resiliency): Priority centered on high-voltage grid isolation, fuel supply verification, and backup generator readiness.",
    getActions: (name, cat, wind, dist, elev) => [
      `Initiate controlled electrical load shed and switch to hardened standalone diesel generators at ${name}.`,
      `Verify 72-hour fuel supply for emergency generators and test automatic transfer switches.`,
      `Isolate non-essential sub-circuits to prevent electrical fires and short-circuit damage from salt spray.`,
      `Seal high-voltage transformer basements and battery storage banks against floodwaters.`,
      `Pre-stage emergency electrical repair kits, spare fuses, and portable floodlights.`
    ]
  },
  {
    mode: "EVACUATION & HUMAN SAFETY LOGISTICS",
    summaryPrefix: "Strategy Focus Gamma (Personnel Protection & Emergency Comms): Priority centered on staff evacuation, emergency satellite links, and NDRF coordination.",
    getActions: (name, cat, wind, dist, elev) => [
      `Issue mandatory evacuation order for non-essential staff at ${name} ${Math.max(2, Math.round(dist / 20))} hours prior to landfall.`,
      `Establish direct 24/7 satellite radio channel with District Disaster Management Authority (DDMA).`,
      `Stockpile 5-day supply of drinking water, emergency medical kits, and satellite phones in reinforced shelter.`,
      `Verify emergency head-count logging and clear evacuation transport routes.`,
      `Deploy trained facility first-responders to coordinate with incoming NDRF rescue teams.`
    ]
  },
  {
    mode: "POST-STORM RECOVERY PRE-POSITIONING",
    summaryPrefix: "Strategy Focus Delta (Rapid Post-Landfall Recovery): Priority centered on pre-staging heavy clearance equipment, salvage tugs, and emergency restoration teams.",
    getActions: (name, cat, wind, dist, elev) => [
      `Pre-position heavy clearing machinery (excavators, chain saws, dewatering pumps) in protected inland staging yards.`,
      `Prepare emergency salvage and debris clearing teams for immediate deployment post-landfall.`,
      `Stockpile critical replacement parts (valves, cables, pipe fittings) in elevated storage lockers.`,
      `Designate priority access corridors for emergency utility restoration crews.`,
      `Set up post-landfall damage assessment protocols and drone survey inspection teams.`
    ]
  }
];

/**
 * Generate dynamic fallback mitigation plan with guaranteed strategy rotation on every call
 */
function generateFallbackMitigation(asset, risk) {
  const status = risk?.status || "MODERATE";
  const score = risk?.riskScore || 50;
  const dist = risk?.distanceKm || 45;
  const wind = risk?.estimatedWindSpeed || 110;
  const elev = asset?.elevation || 5;
  const name = asset?.name || "Critical Infrastructure Facility";
  const cat = asset?.category || "Infrastructure";

  const rev = generationCounter++;
  const profileIndex = (rev - 1) % STRATEGY_PROFILES.length;
  const profile = STRATEGY_PROFILES[profileIndex];

  let priority = "HIGH";
  if (status === "CRITICAL") priority = "IMMEDIATE";
  else if (status === "SAFE") priority = "PRECAUTIONARY";

  const actions = profile.getActions(name, cat, wind, dist, elev);
  const summary = `[Plan Option #${rev} - ${profile.mode}] ${profile.summaryPrefix} Facility facing estimated wind speed of ${wind} km/h at ${dist} km from storm core.`;

  return {
    priority,
    summary,
    actions,
    source: `fallback-strategy-${profileIndex + 1}`,
    timestamp: new Date().toLocaleTimeString()
  };
}

/**
 * Call Gemini API if API key is provided, or fall back to heuristic mitigation planner
 */
async function generateMitigationPlan(asset, risk) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return generateFallbackMitigation(asset, risk);
  }

  try {
    const fetchFn = globalThis.fetch || fetch;
    const rev = generationCounter++;
    const prompt = `You are a Senior Disaster Management & Infrastructure Mitigation Expert responding to an approaching cyclone.
Generate a completely new, unique emergency mitigation plan (Plan Option #${rev}, timestamp: ${new Date().toISOString()}) for the following critical asset:

Asset Name: ${asset.name}
Category: ${asset.category}
Region: ${asset.region}
Elevation: ${asset.elevation} meters
Vulnerability Score: ${asset.vulnerability}/100
Current Cyclone Distance: ${risk.distanceKm} km
Estimated Local Wind Exposure: ${risk.estimatedWindSpeed} km/h
Risk Classification: ${risk.status} (Score: ${risk.riskScore}/100)

Provide 5 specific, highly tactical emergency action items tailored for this facility. Make this plan distinct from previous options.

Return a strictly valid JSON object with the exact format:
{
  "priority": "IMMEDIATE" | "HIGH" | "MODERATE",
  "summary": "Concise 2-sentence risk summary focusing on operational impact",
  "actions": ["Action item 1", "Action item 2", "Action item 3", "Action item 4", "Action item 5"]
}`;

    const response = await fetchFn(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Invalid response format from Gemini API");
    }

    const parsed = JSON.parse(candidateText);
    return {
      priority: parsed.priority || "HIGH",
      summary: `[Plan Option #${rev}] ${parsed.summary || `Emergency plan for ${asset.name}`}`,
      actions: parsed.actions || [],
      source: "gemini-api",
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (err) {
    console.warn("Gemini API call returned error, using strategy profile planner:", err.message);
    return generateFallbackMitigation(asset, risk);
  }
}

module.exports = {
  generateMitigationPlan
};
