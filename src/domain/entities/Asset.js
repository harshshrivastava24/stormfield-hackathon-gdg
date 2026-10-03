export class Asset {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || 'Unnamed Asset';
    this.region = data.region || 'visakhapatnam';
    this.category = data.category || 'General Infrastructure';
    this.lat = data.lat || 0;
    this.lng = data.lng || 0;
    this.elevation = data.elevation || 5.0;
    this.vulnerability = data.vulnerability || 50;
    this.capacity = data.capacity || 'N/A';
    this.primaryRiskFactors = data.primaryRiskFactors || [];
  }
}
