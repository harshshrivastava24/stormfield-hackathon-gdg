import apiClient from '../api/apiClient';

export const cycloneRepository = {
  async getCycloneTrack(region = 'visakhapatnam') {
    try {
      const response = await apiClient.get('/cyclone', { params: { region } });
      return response.data.data;
    } catch (error) {
      console.warn('Backend API request failed for cyclone track, using local fallback:', error.message);
      return getFallbackCycloneTrack(region);
    }
  }
};

function getFallbackCycloneTrack(region) {
  if (region === 'puri') {
    return {
      cycloneName: "Cyclone RUDRAN (Simulated)",
      region: "puri",
      regionName: "Puri, Odisha",
      mapCenter: [19.82, 85.85],
      zoom: 11,
      points: [
        { step: 0, timeLabel: "T - 18 Hours", timestamp: "2026-10-03 00:00 UTC", lat: 18.50, lng: 86.80, windSpeed: 90, pressure: 988, category: "Severe Cyclonic Storm" },
        { step: 1, timeLabel: "T - 15 Hours", timestamp: "2026-10-03 03:00 UTC", lat: 18.90, lng: 86.50, windSpeed: 110, pressure: 978, category: "Severe Cyclonic Storm" },
        { step: 2, timeLabel: "T - 12 Hours", timestamp: "2026-10-03 06:00 UTC", lat: 19.30, lng: 86.20, windSpeed: 130, pressure: 970, category: "Very Severe Cyclonic Storm" },
        { step: 3, timeLabel: "T - 9 Hours", timestamp: "2026-10-03 09:00 UTC", lat: 19.55, lng: 86.00, windSpeed: 150, pressure: 958, category: "Very Severe Cyclonic Storm" },
        { step: 4, timeLabel: "T - 6 Hours", timestamp: "2026-10-03 12:00 UTC", lat: 19.70, lng: 85.90, windSpeed: 170, pressure: 945, category: "Extremely Severe Cyclonic Storm" },
        { step: 5, timeLabel: "T - 3 Hours", timestamp: "2026-10-03 15:00 UTC", lat: 19.80, lng: 85.82, windSpeed: 185, pressure: 935, category: "Super Cyclonic Storm" },
        { step: 6, timeLabel: "T + 0 Hours (Landfall)", timestamp: "2026-10-03 18:00 UTC", lat: 19.85, lng: 85.80, windSpeed: 175, pressure: 942, category: "Landfall Peak Impact" },
        { step: 7, timeLabel: "T + 6 Hours", timestamp: "2026-10-04 00:00 UTC", lat: 20.15, lng: 85.50, windSpeed: 95, pressure: 982, category: "Severe Cyclonic Storm" }
      ]
    };
  }

  return {
    cycloneName: "Cyclone VARUNA (Simulated)",
    region: "visakhapatnam",
    regionName: "Visakhapatnam, Andhra Pradesh",
    mapCenter: [17.70, 83.25],
    zoom: 11,
    points: [
      { step: 0, timeLabel: "T - 18 Hours", timestamp: "2026-10-03 00:00 UTC", lat: 16.50, lng: 84.80, windSpeed: 95, pressure: 985, category: "Severe Cyclonic Storm" },
      { step: 1, timeLabel: "T - 15 Hours", timestamp: "2026-10-03 03:00 UTC", lat: 16.85, lng: 84.40, windSpeed: 115, pressure: 976, category: "Very Severe Cyclonic Storm" },
      { step: 2, timeLabel: "T - 12 Hours", timestamp: "2026-10-03 06:00 UTC", lat: 17.20, lng: 84.00, windSpeed: 135, pressure: 968, category: "Very Severe Cyclonic Storm" },
      { step: 3, timeLabel: "T - 9 Hours", timestamp: "2026-10-03 09:00 UTC", lat: 17.45, lng: 83.65, windSpeed: 155, pressure: 955, category: "Extremely Severe Cyclonic Storm" },
      { step: 4, timeLabel: "T - 6 Hours", timestamp: "2026-10-03 12:00 UTC", lat: 17.60, lng: 83.40, windSpeed: 165, pressure: 948, category: "Extremely Severe Cyclonic Storm" },
      { step: 5, timeLabel: "T - 3 Hours", timestamp: "2026-10-03 15:00 UTC", lat: 17.68, lng: 83.25, windSpeed: 175, pressure: 940, category: "Extremely Severe Cyclonic Storm" },
      { step: 6, timeLabel: "T + 0 Hours (Landfall)", timestamp: "2026-10-03 18:00 UTC", lat: 17.72, lng: 83.18, windSpeed: 160, pressure: 950, category: "Landfall Peak Impact" },
      { step: 7, timeLabel: "T + 6 Hours", timestamp: "2026-10-04 00:00 UTC", lat: 18.00, lng: 82.80, windSpeed: 85, pressure: 988, category: "Cyclonic Storm" }
    ]
  };
}
