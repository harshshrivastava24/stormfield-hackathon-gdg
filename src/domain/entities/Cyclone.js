export class Cyclone {
  constructor(data = {}) {
    this.name = data.cycloneName || 'Simulated Cyclone';
    this.region = data.region || 'visakhapatnam';
    this.mapCenter = data.mapCenter || [17.7, 83.25];
    this.zoom = data.zoom || 11;
    this.points = data.points || [];
  }

  getPointAtStep(stepIndex) {
    if (!this.points || this.points.length === 0) return null;
    const clampedIndex = Math.max(0, Math.min(stepIndex, this.points.length - 1));
    return this.points[clampedIndex];
  }
}
