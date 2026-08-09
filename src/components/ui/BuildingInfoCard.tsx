import React from 'react';
import { Home, ShieldCheck, Zap, Sun, Car } from 'lucide-react';
import { BuildingConfig } from '../../types/building';

interface BuildingInfoCardProps {
  config: BuildingConfig;
}

export const BuildingInfoCard: React.FC<BuildingInfoCardProps> = ({ config }) => {
  const height = (4.2 + (config.floors - 1) * 3.2).toFixed(1);
  const totalUnits = config.floors * 4;

  return (
    <div className="absolute top-20 right-4 z-10 hidden lg:block pointer-events-auto">
      <div className="glass-panel w-64 rounded-2xl p-4 shadow-xl text-slate-200 border border-slate-700/50 space-y-3">
        
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Architectural Specs</span>
          <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <ShieldCheck className="h-3 w-3" /> VERIFIED
          </span>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Total Height</span>
            <span className="text-sm font-extrabold text-white">{height} <span className="text-xs font-normal text-slate-400">meters</span></span>
          </div>

          <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Apt. Capacity</span>
            <span className="text-sm font-extrabold text-emerald-400">{totalUnits} <span className="text-xs font-normal text-slate-400">Units</span></span>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Included Amenities</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
              <Home className="h-3 w-3 text-emerald-400" /> Ground Lobby
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
              <Sun className="h-3 w-3 text-amber-400" /> Roof Solar Array
            </span>
            {config.showBalconies && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
                <Zap className="h-3 w-3 text-blue-400" /> Glass Balconies
              </span>
            )}
            {config.showParking && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
                <Car className="h-3 w-3 text-indigo-400" /> Parking Bays
              </span>
            )}
          </div>
        </div>

        {/* Completion Tag */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900/80 p-2.5 border border-emerald-500/20 text-[11px] flex items-center justify-between">
          <span className="text-slate-300 font-medium">Expected Handover:</span>
          <span className="font-bold text-emerald-400">Q4 2026</span>
        </div>

      </div>
    </div>
  );
};
