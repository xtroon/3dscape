import React from 'react';
import {
  Building2,
  Trees,
  Car,
  Waves,
  Landmark,
  Compass,
  MapPin,
  Plus,
  X,
  Sparkles,
  Sun,
} from 'lucide-react';

import { PlacementTool, SiteElementType } from '../../types/building';

interface SitePlannerToolbarProps {
  placementTool: PlacementTool;
  onSelectPlacementTool: (tool: PlacementTool) => void;
}

export const SitePlannerToolbar: React.FC<SitePlannerToolbarProps> = ({
  placementTool,
  onSelectPlacementTool,
}) => {
  const tools: { id: SiteElementType | 'building'; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'building',
      label: 'Building',
      icon: <Building2 className="h-4 w-4" />,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30',
    },
    {
      id: 'road',
      label: 'Road',
      icon: <Compass className="h-4 w-4" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    {
      id: 'park',
      label: 'Park',
      icon: <Trees className="h-4 w-4" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },

    {
      id: 'parking',
      label: 'Parking',
      icon: <Car className="h-4 w-4" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    {
      id: 'pool',
      label: 'Pool',
      icon: <Waves className="h-4 w-4 text-blue-400" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    {
      id: 'clubhouse',
      label: 'Clubhouse',
      icon: <Landmark className="h-4 w-4" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    {
      id: 'tree',
      label: 'Tree',
      icon: <Trees className="h-4 w-4 text-emerald-400" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    {
      id: 'street_light',
      label: 'Street Lamp',
      icon: <Sun className="h-4 w-4 text-amber-400" />,
      color: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-amber-500/30',
    },
  ];


  return (
    <div className="absolute top-20 left-1/2 z-20 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2">
      {/* Active Placement Banner notification */}
      {placementTool && (
        <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/40 shadow-xl animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Click ground plot to place {placementTool.toUpperCase().replace('_', ' ')}</span>
          <button
            onClick={() => onSelectPlacementTool(null)}
            className="ml-2 rounded-full bg-slate-800 p-0.5 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Cancel placement mode"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Placement Bar */}
      <div className="glass-panel flex items-center gap-1.5 rounded-2xl p-1.5 shadow-2xl border border-slate-700/60">
        <span className="hidden md:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2.5">
          <MapPin className="h-3.5 w-3.5" /> Placement Tools:
        </span>

        {tools.map((t) => {
          const isActive = placementTool === t.id;
          return (
            <button
              key={`tool-${t.id}`}
              onClick={() => onSelectPlacementTool(isActive ? null : t.id)}
              title={isActive ? 'Cancel placement' : `Click to place ${t.label} on plot`}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-md ${
                isActive
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-emerald-500/40 scale-105'
                  : t.color
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
