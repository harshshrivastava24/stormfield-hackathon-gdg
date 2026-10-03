import apiClient from '../../infrastructure/api/apiClient';

export async function generateMitigationPlan(asset, risk) {
  try {
    const response = await apiClient.post('/mitigation', { asset, risk });
    return response.data.data;
  } catch (error) {
    console.warn('Backend mitigation service error, returning fallback plan:', error.message);
    return {
      priority: risk?.status === 'CRITICAL' ? 'IMMEDIATE' : 'HIGH',
      summary: `Emergency mitigation plan for ${asset?.name || 'Selected Asset'}. High-wind & surge risk preparedness protocol active.`,
      actions: [
        `Initiate priority structural and electrical shutdown checks at ${asset?.name}.`,
        `Secure auxiliary power generation and test emergency transfer switches.`,
        `Clear drainage pathways around base elevation level (${asset?.elevation || 3}m).`,
        `Evacuate non-essential personnel and coordinate with local NDRF rescue units.`
      ],
      source: 'client-fallback'
    };
  }
}
