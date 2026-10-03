import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getStatusColor } from '../../../domain/risk/riskRules';
import { Wind, ShieldAlert, Navigation, Layers } from 'lucide-react';

// Helper component to smoothly recenter map when region changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcon creator for Infrastructure Assets
function createAssetIcon(status, riskScore) {
  let colorClass = 'pin-safe';
  if (status === 'CRITICAL') colorClass = 'pin-critical';
  else if (status === 'MODERATE') colorClass = 'pin-moderate';

  const html = `
    <div class="custom-pin ${colorClass} text-white font-bold text-xs shadow-lg" style="width: 32px; height: 32px;">
      ${riskScore}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-asset-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

// Custom DivIcon creator for Cyclone Center
function createCycloneIcon(windSpeed) {
  const html = `
    <div class="cyclone-marker" style="width: 48px; height: 48px;">
      <div style="font-size: 20px; font-weight: bold; color: #ef4444; text-shadow: 0 0 8px rgba(0,0,0,0.8);">🌀</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cyclone-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
}

export function CycloneMap({
  cycloneTrack,
  currentStep,
  riskData,
  selectedAssetId,
  onSelectAsset,
  onGenerateMitigation
}) {
  const mapCenter = cycloneTrack?.mapCenter || [17.7, 83.25];
  const zoom = cycloneTrack?.zoom || 11;
  const points = cycloneTrack?.points || [];
  const currentCyclone = points[currentStep] || points[0];

  const polylineCoords = points.map((p) => [p.lat, p.lng]);
  const pastCoords = points.slice(0, currentStep + 1).map((p) => [p.lat, p.lng]);
  const futureCoords = points.slice(currentStep).map((p) => [p.lat, p.lng]);

  const riskLookup = React.useMemo(() => {
    const map = {};
    if (riskData && riskData.data) {
      riskData.data.forEach((r) => {
        map[r.assetId] = r;
      });
    }
    return map;
  }, [riskData]);

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[1000] glass-panel p-3 rounded-lg text-xs space-y-2 border border-slate-700/60 shadow-lg hidden md:block">
        <div className="flex items-center gap-1.5 text-slate-200 font-bold border-b border-slate-700/60 pb-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Infrastructure Vulnerability Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          <span className="text-slate-300 font-medium">Safe (0 - 39)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
          <span className="text-slate-300 font-medium">Moderate Risk (40 - 69)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
          <span className="text-slate-300 font-medium">Critical Risk (70 - 100)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50 text-slate-400">
          <span>🌀</span> Cyclone Position Eye
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={mapCenter} zoom={zoom} />

        {/* Tile Layer with optional API key support */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            import.meta.env.VITE_MAP_TILES_URL
              ? import.meta.env.VITE_MAP_TILES_URL.replace('{apiKey}', import.meta.env.VITE_MAP_API_KEY || '')
              : (import.meta.env.VITE_MAP_API_KEY
                  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_MAP_API_KEY}`
                  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png")
          }
          maxZoom={19}
        />

        {/* Cyclone Trajectory Path */}
        {pastCoords.length > 1 && (
          <Polyline
            positions={pastCoords}
            pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.9 }}
          />
        )}
        {futureCoords.length > 1 && (
          <Polyline
            positions={futureCoords}
            pathOptions={{ color: '#f59e0b', weight: 3, opacity: 0.7, dashArray: '6, 8' }}
          />
        )}

        {/* Trajectory Waypoints */}
        {points.map((p, idx) => (
          <Circle
            key={`track-pt-${idx}`}
            center={[p.lat, p.lng]}
            radius={idx === currentStep ? 1200 : 600}
            pathOptions={{
              color: idx === currentStep ? '#ef4444' : idx < currentStep ? '#94a3b8' : '#f59e0b',
              fillColor: idx === currentStep ? '#ef4444' : '#1e293b',
              fillOpacity: 0.8
            }}
          />
        ))}

        {/* Cyclone Danger Impact Circles around active cyclone eye */}
        {currentCyclone && (
          <>
            {/* 30km Core High-Wind Zone */}
            <Circle
              center={[currentCyclone.lat, currentCyclone.lng]}
              radius={30000}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.18,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            />
            {/* 70km Warning Radius */}
            <Circle
              center={[currentCyclone.lat, currentCyclone.lng]}
              radius={70000}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#f59e0b',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '8, 8'
              }}
            />

            {/* Active Cyclone Eye Marker */}
            <Marker
              position={[currentCyclone.lat, currentCyclone.lng]}
              icon={createCycloneIcon(currentCyclone.windSpeed)}
              zIndexOffset={2000}
            >
              <Popup className="dark-popup">
                <div className="p-1 text-slate-900 font-sans">
                  <div className="flex items-center gap-1.5 font-bold text-red-600 text-sm">
                    <span>🌀</span> {cycloneTrack?.cycloneName}
                  </div>
                  <div className="text-xs text-slate-700 mt-1 space-y-0.5">
                    <p><strong>Step:</strong> {currentCyclone.timeLabel}</p>
                    <p><strong>Category:</strong> {currentCyclone.category}</p>
                    <p><strong>Peak Wind:</strong> {currentCyclone.windSpeed} km/h</p>
                    <p><strong>Central Pressure:</strong> {currentCyclone.pressure} hPa</p>
                    <p><strong>Position:</strong> {currentCyclone.lat.toFixed(2)}°N, {currentCyclone.lng.toFixed(2)}°E</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Infrastructure Asset Markers */}
        {riskData &&
          riskData.data &&
          riskData.data.map((item) => {
            const isSelected = item.assetId === selectedAssetId;
            const statusStyle = getStatusColor(item.status);

            return (
              <Marker
                key={item.assetId}
                position={[item.lat, item.lng]}
                icon={createAssetIcon(item.status, item.riskScore)}
                eventHandlers={{
                  click: () => onSelectAsset(item.assetId)
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 font-sans w-52">
                    <div className="flex items-center justify-between font-bold text-sm text-slate-900 border-b pb-1 mb-1">
                      <span>{item.assetName}</span>
                    </div>
                    <div className="text-xs space-y-1 text-slate-700">
                      <p><strong>Category:</strong> {item.category}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span>Risk Score:</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-white font-bold text-xs"
                          style={{ backgroundColor: statusStyle.hex }}
                        >
                          {item.riskScore} ({item.status})
                        </span>
                      </div>
                      <p><strong>Dist. to Storm Eye:</strong> {item.distanceKm} km</p>
                      <p><strong>Wind Exp:</strong> {item.estimatedWindSpeed} km/h</p>
                      <p><strong>Elevation:</strong> {item.elevation} m</p>
                    </div>
                    <button
                      onClick={() => onGenerateMitigation(item)}
                      className="mt-2.5 w-full py-1.5 px-2 bg-slate-900 text-cyan-400 hover:bg-slate-800 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> AI Mitigation Plan
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
