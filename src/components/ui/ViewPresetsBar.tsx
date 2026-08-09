import React from 'react';
import {
  Map,
  Footprints,
  Eye,
  Target,
  RotateCcw,
} from 'lucide-react';
import { CameraPreset } from '../../types/building';

interface ViewPresetsBarProps {
  currentPreset: CameraPreset;
  hasSelectedItem: boolean;
  onSelectPreset: (preset: CameraPreset) => void;
  onFocusSelectedItem: () => void;
  onResetView: () => void;
}

export const ViewPresetsBar: React.FC<ViewPresetsBarProps> = ({
  currentPreset,
  hasSelectedItem,
  onSelectPreset,
  onFocusSelectedItem,
  onResetView,
}) => {
  const presets: { id: CameraPreset; label: string; icon: React.ReactNode; tooltip: string }[] = [
    {
      id: 'master_map',
      label: 'Master Map (3D)',
      icon: <Map className="h-4 w-4 text-emerald-400" />,
      tooltip: 'Google Maps style free ground exploration & overhead view',
    },
    {
      id: 'street',
      label: 'Street View',
      icon: <Eye className="h-4 w-4 text-blue-400" />,
      tooltip: 'Street level perspective overview',
    },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2">

      {/* Simplified Presets Bar */}
      <div className="glass-panel flex items-center gap-1.5 rounded-2xl p-1.5 shadow-2xl border border-slate-700/60">
        {presets.map((preset) => {
          const isActive = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              title={preset.tooltip}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {preset.icon}
              <span>{preset.label}</span>
            </button>
          );
        })}

        {/* Focus Selected Item Button */}
        {hasSelectedItem && (
          <>
            <div className="h-5 w-[1px] bg-slate-700/60 mx-1" />
            <button
              onClick={onFocusSelectedItem}
              title="Center camera on currently selected building or item"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-slate-700 transition-all active:scale-95 border border-emerald-500/30"
            >
              <Target className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Focus Selected</span>
            </button>
          </>
        )}

        <div className="h-5 w-[1px] bg-slate-700/60 mx-1" />

        <button
          onClick={onResetView}
          title="Reset camera perspective"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
