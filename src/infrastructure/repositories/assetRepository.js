import apiClient from '../api/apiClient';

export const assetRepository = {
  async getAssetsByRegion(region = 'visakhapatnam') {
    try {
      const response = await apiClient.get(`/assets`, { params: { region } });
      return response.data.data;
    } catch (error) {
      console.warn('Backend API request failed for assets, using local fallback:', error.message);
      // Client-side fallback if backend is unreachable
      const fallbackAssets = getFallbackAssets(region);
      return fallbackAssets;
    }
  }
};

function getFallbackAssets(region) {
  if (region === 'puri') {
    return [
      { id: "puri-01", name: "Puri Swargadwar Coastal Embankment", region: "puri", category: "Coastal Protection", lat: 19.795, lng: 85.815, elevation: 1.8, vulnerability: 95 },
      { id: "puri-02", name: "Jagannath Temple Heritage & Shelter Zone", region: "puri", category: "Heritage & Shelter", lat: 19.805, lng: 85.818, elevation: 12.0, vulnerability: 35 },
      { id: "puri-03", name: "Puri District Headquarters Hospital", region: "puri", category: "Healthcare", lat: 19.815, lng: 85.828, elevation: 7.0, vulnerability: 50 },
      { id: "puri-04", name: "Puri Railway Terminal Control Hub", region: "puri", category: "Transportation", lat: 19.822, lng: 85.839, elevation: 6.5, vulnerability: 60 },
      { id: "puri-05", name: "Balukhand Multipurpose Cyclone Shelter", region: "puri", category: "Evacuation Shelter", lat: 19.828, lng: 85.875, elevation: 4.0, vulnerability: 30 },
      { id: "puri-06", name: "Konark Marine Drive Bridge", region: "puri", category: "Transportation Bridge", lat: 19.865, lng: 86.020, elevation: 2.2, vulnerability: 85 },
      { id: "puri-07", name: "Chandrabhaga Solar & Thermal Power Station", region: "puri", category: "Power Generation", lat: 19.880, lng: 86.090, elevation: 3.1, vulnerability: 80 },
      { id: "puri-08", name: "Astaranga Deepwater Fishing Harbor", region: "puri", category: "Port Infrastructure", lat: 19.970, lng: 86.260, elevation: 1.5, vulnerability: 90 },
      { id: "puri-09", name: "Brahmagiri High-Voltage Substation", region: "puri", category: "Power Substation", lat: 19.800, lng: 85.650, elevation: 5.5, vulnerability: 70 },
      { id: "puri-10", name: "Satapada Chilika Water Treatment Plant", region: "puri", category: "Water Management", lat: 19.670, lng: 85.450, elevation: 2.0, vulnerability: 75 },
      { id: "puri-11", name: "Malatipatpur Bus Rapid Transit Terminal", region: "puri", category: "Transportation", lat: 19.845, lng: 85.845, elevation: 8.0, vulnerability: 45 },
      { id: "puri-12", name: "Puri Telecom Central Switching Exchange", region: "puri", category: "Communications", lat: 19.810, lng: 85.832, elevation: 9.0, vulnerability: 65 }
    ];
  }

  return [
    { id: "vsp-01", name: "Vizag Port Container Terminal", region: "visakhapatnam", category: "Port Infrastructure", lat: 17.695, lng: 83.295, elevation: 2.5, vulnerability: 85 },
    { id: "vsp-02", name: "Naval Dockyard Visakhapatnam", region: "visakhapatnam", category: "Defense & Maritime", lat: 17.685, lng: 83.280, elevation: 3.0, vulnerability: 70 },
    { id: "vsp-03", name: "HPCL Oil Refinery & Storage", region: "visakhapatnam", category: "Fuel & Energy", lat: 17.690, lng: 83.250, elevation: 4.5, vulnerability: 90 },
    { id: "vsp-04", name: "Simhadri Super Thermal Power Plant", region: "visakhapatnam", category: "Power Generation", lat: 17.605, lng: 83.155, elevation: 6.0, vulnerability: 65 },
    { id: "vsp-05", name: "King George Tertiary Hospital", region: "visakhapatnam", category: "Healthcare", lat: 17.708, lng: 83.305, elevation: 12.0, vulnerability: 45 },
    { id: "vsp-06", name: "Visakhapatnam International Airport", region: "visakhapatnam", category: "Transportation", lat: 17.721, lng: 83.225, elevation: 5.0, vulnerability: 60 },
    { id: "vsp-07", name: "Rushikonda IT Substation & Hub", region: "visakhapatnam", category: "Telecom & Power Grid", lat: 17.782, lng: 83.385, elevation: 8.0, vulnerability: 55 },
    { id: "vsp-08", name: "Meghadrigedda Dam & Water Reservoir", region: "visakhapatnam", category: "Water Management", lat: 17.740, lng: 83.200, elevation: 18.0, vulnerability: 75 },
    { id: "vsp-09", name: "RK Beach Evacuation Center", region: "visakhapatnam", category: "Evacuation Shelter", lat: 17.714, lng: 83.324, elevation: 2.0, vulnerability: 40 },
    { id: "vsp-10", name: "Visakhapatnam Steel Plant Logistics Depot", region: "visakhapatnam", category: "Industrial Logistics", lat: 17.635, lng: 83.170, elevation: 14.0, vulnerability: 50 },
    { id: "vsp-11", name: "Bheemunipatnam Telecom Relay Mast", region: "visakhapatnam", category: "Communications", lat: 17.890, lng: 83.450, elevation: 3.5, vulnerability: 80 },
    { id: "vsp-12", name: "Gangavaram Deepwater Port Terminal", region: "visakhapatnam", category: "Port Infrastructure", lat: 17.620, lng: 83.240, elevation: 2.8, vulnerability: 80 }
  ];
}
