import React from 'react';
import {
  LayoutGrid,
  Footprints,
  Eye,
  Building,
  Compass,
  Layers,
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
      id: 'top_site',
      label: 'Top Site View',
      icon: <LayoutGrid className="h-4 w-4 text-emerald-400" />,
      tooltip: 'Overhead master planning layout view',
    },
    {
      id: 'street_walk',
      label: 'Street Walk Mode',
      icon: <Footprints className="h-4 w-4 text-amber-400" />,
      tooltip: 'Human eye-level WASD keyboard walking mode',
    },
    {
      id: 'street',
      label: 'Street View',
      icon: <Eye className="h-4 w-4" />,
      tooltip: 'Human eye-level street view',
    },
    {
      id: 'front',
      label: 'Front View',
      icon: <Building className="h-4 w-4" />,
      tooltip: 'Front site overview',
    },
    {
      id: 'side',
      label: 'Side View',
      icon: <Compass className="h-4 w-4" />,
      tooltip: 'Perspective side profile',
    },
    {
      id: 'elevated',
      label: 'Elevated View',
      icon: <Layers className="h-4 w-4" />,
      tooltip: '3D aerial isometric perspective',
    },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2">
      {/* WASD Walking navigation helper notification */}
      {currentPreset === 'street_walk' && (
        <div className="glass-panel flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/40 shadow-xl">
          <Footprints className="h-3.5 w-3.5 text-amber-400" />
          <span>Use WASD or Arrow Keys to walk down any street!</span>
        </div>
      )}

      {/* Main Presets Bar */}
      <div className="glass-panel flex items-center gap-1.5 rounded-2xl p-1.5 shadow-2xl border border-slate-700/60">
        {presets.map((preset) => {
          const isActive = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              title={preset.tooltip}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {preset.icon}
              <span className="hidden sm:inline">{preset.label}</span>
            </button>
          );
        })}

        {/* Focus Camera on Selected Item Button */}
        {hasSelectedItem && (
          <>
            <div className="h-5 w-[1px] bg-slate-700/60 mx-1" />
            <button
              onClick={onFocusSelectedItem}
              title="Focus camera target on selected building or item"
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
