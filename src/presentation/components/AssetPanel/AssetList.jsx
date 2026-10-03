import React, { useState } from 'react';
import { getStatusColor } from '../../../domain/risk/riskRules';
import { Search, Filter, ChevronRight, ShieldAlert, ArrowUpDown } from 'lucide-react';

export function AssetList({
  assets = [],
  riskData = [],
  selectedAssetId,
  onSelectAsset,
  onGenerateMitigation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RISK_DESC');

  // Merge asset metadata with calculated live risk object
  const mergedList = React.useMemo(() => {
    const riskMap = {};
    if (riskData && Array.isArray(riskData)) {
      riskData.forEach((r) => {
        riskMap[r.assetId] = r;
      });
    }

    return assets.map((a) => {
      const risk = riskMap[a.id] || {
        riskScore: 0,
        status: 'SAFE',
        distanceKm: 0,
        estimatedWindSpeed: 0
      };
      return { ...a, risk };
    });
  }, [assets, riskData]);

  // Filter & Search
  const filteredList = React.useMemo(() => {
    return mergedList
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'ALL' || item.risk.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'RISK_DESC') return b.risk.riskScore - a.risk.riskScore;
        if (sortBy === 'RISK_ASC') return a.risk.riskScore - b.risk.riskScore;
        if (sortBy === 'DIST_ASC') return a.risk.distanceKm - b.risk.distanceKm;
        if (sortBy === 'NAME') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [mergedList, searchTerm, statusFilter, sortBy]);

  return (
    <div className="flex flex-col h-full rounded-xl glass-panel border border-slate-700/60 shadow-xl overflow-hidden">
      {/* Panel Header & Controls */}
      <div className="p-3.5 border-b border-slate-700/60 space-y-3 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <span>Infrastructure Assets</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-cyan-400 font-mono">
              {filteredList.length}
            </span>
          </h3>

          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs border border-slate-700 rounded px-2 py-1 focus:outline-none"
            >
              <option value="RISK_DESC">Sort: Highest Risk</option>
              <option value="RISK_ASC">Sort: Lowest Risk</option>
              <option value="DIST_ASC">Sort: Closest to Eye</option>
              <option value="NAME">Sort: Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Search & Status Filter row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-100 rounded-lg pl-8 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs border border-slate-700 rounded-lg px-2.5 py-2 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="MODERATE">Moderate Only</option>
            <option value="SAFE">Safe Only</option>
          </select>
        </div>
      </div>

      {/* Asset List Scroll Container */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-[440px]">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No infrastructure assets found matching query.
          </div>
        ) : (
          filteredList.map((item) => {
            const isSelected = item.id === selectedAssetId;
            const statusStyle = getStatusColor(item.risk.status);

            return (
              <div
                key={item.id}
                onClick={() => onSelectAsset(item.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{item.category}</p>
                  </div>

                  {/* Live Risk Badge */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-extrabold rounded-md border ${statusStyle.badgeBg} ${statusStyle.badgeText} ${statusStyle.badgeBorder}`}
                    >
                      {item.risk.riskScore} / 100
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 text-slate-400">
                      {item.risk.status}
                    </span>
                  </div>
                </div>

                {/* Quantitative Details */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
                  <div>
                    <span className="text-slate-500">Distance: </span>
                    <span className="font-semibold">{item.risk.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Wind: </span>
                    <span className="font-semibold">{item.risk.estimatedWindSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Elevation: </span>
                    <span className="font-semibold">{item.elevation} m</span>
                  </div>
                </div>

                {/* Quick Action */}
                <div className="mt-2 flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Base Vuln: <strong className="text-slate-300">{item.vulnerability}%</strong>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAsset(item.id);
                      onGenerateMitigation(item, item.risk);
                    }}
                    className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors"
                  >
                    <ShieldAlert className="w-3 h-3" /> Mitigation Plan
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
