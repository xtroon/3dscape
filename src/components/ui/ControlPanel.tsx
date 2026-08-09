import React, { useState } from 'react';
import {
  Layers,
  CheckSquare,
  Square,
  Palette,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  Car,
  LucideIcon
} from 'lucide-react';
import { BuildingConfig } from '../../types/building';

interface ControlPanelProps {
  config: BuildingConfig;
  onChangeConfig: (newConfig: Partial<BuildingConfig>) => void;
  onResetView: () => void;
  onRandomizeColors: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onResetView,
  onRandomizeColors,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Preset Color Palettes for quick architectural previewing
  const wallSwatches = ['#e2e8f0', '#f1f5f9', '#334155', '#78350f', '#0f172a', '#d97706'];
  const windowSwatches = ['#38bdf8', '#0284c7', '#0f172a', '#34d399', '#fef08a'];
  const trimSwatches = ['#1e293b', '#64748b', '#0284c7', '#d97706', '#ffffff'];

  const totalHeight = (4.2 + (config.floors - 1) * 3.2).toFixed(1);
  const totalUnits = config.floors * 4;

  return (
    <div
      className={`absolute top-20 left-4 z-20 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[-105%]' : 'translate-x-0'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-9 top-4 flex h-9 w-9 items-center justify-center rounded-r-xl glass-panel text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl border-l-0"
        title={isCollapsed ? 'Expand Control Panel' : 'Collapse Control Panel'}
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Main Glassmorphic Control Card */}
      <div className="glass-panel w-80 max-h-[82vh] overflow-y-auto rounded-2xl p-4 shadow-2xl flex flex-col gap-4 text-slate-100">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">Building Controls</h2>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
            v1.0
          </span>
        </div>

        {/* Structure Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-400" /> Building Floors
            </span>
            <span className="text-emerald-400 font-bold">{totalHeight} m height</span>
          </div>

          {/* Floor Stepper Controls [-] N [+] */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 ml-2">Floors</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeConfig({ floors: Math.max(1, config.floors - 1) })}
                disabled={config.floors <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all active:scale-95"
                title="Decrease floors"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-6 text-center text-base font-extrabold text-white">
                {config.floors}
              </span>

              <button
                onClick={() => onChangeConfig({ floors: Math.min(10, config.floors + 1) })}
                disabled={config.floors >= 10}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
                title="Increase floors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
            <div className="rounded-lg bg-slate-900/50 p-1.5 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Est. Apartments</span>
              <span className="font-bold text-slate-200">{totalUnits} Units</span>
            </div>
            <div className="rounded-lg bg-slate-900/50 p-1.5 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Structure</span>
              <span className="font-bold text-slate-200">G + {config.floors - 1} Story</span>
            </div>
          </div>
        </div>

        {/* Feature Toggles Section */}
        <div className="space-y-2 border-t border-slate-700/50 pt-3">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Features & Amenities</span>

          {/* Toggle Windows */}
          <button
            onClick={() => onChangeConfig({ showWindows: !config.showWindows })}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-all border border-slate-800"
          >
            <span className="flex items-center gap-2">
              {config.showWindows ? (
                <CheckSquare className="h-4 w-4 text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 text-slate-500" />
              )}
              Windows Facade
            </span>
            <span className={config.showWindows ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
              {config.showWindows ? 'On' : 'Off'}
            </span>
          </button>

          {/* Toggle Balconies */}
          <button
            onClick={() => onChangeConfig({ showBalconies: !config.showBalconies })}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-all border border-slate-800"
          >
            <span className="flex items-center gap-2">
              {config.showBalconies ? (
                <CheckSquare className="h-4 w-4 text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 text-slate-500" />
              )}
              Balconies & Railings
            </span>
            <span className={config.showBalconies ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
              {config.showBalconies ? 'On' : 'Off'}
            </span>
          </button>

          {/* Toggle Parking */}
          <button
            onClick={() => onChangeConfig({ showParking: !config.showParking })}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-all border border-slate-800"
          >
            <span className="flex items-center gap-2">
              {config.showParking ? (
                <CheckSquare className="h-4 w-4 text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 text-slate-500" />
              )}
              Parking Lot & Vehicles
            </span>
            <span className={config.showParking ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
              {config.showParking ? 'On' : 'Off'}
            </span>
          </button>

          {/* Toggle Street Lights */}
          <button
            onClick={() => onChangeConfig({ showStreetLights: !config.showStreetLights })}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-all border border-slate-800"
          >
            <span className="flex items-center gap-2">
              {config.showStreetLights ? (
                <CheckSquare className="h-4 w-4 text-emerald-400" />
              ) : (
                <Square className="h-4 w-4 text-slate-500" />
              )}
              Street Light Posts
            </span>
            <span className={config.showStreetLights ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
              {config.showStreetLights ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        {/* Appearance & Color Picker Section */}
        <div className="space-y-3 border-t border-slate-700/50 pt-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-emerald-400" /> Appearance
            </span>
            <button
              onClick={onRandomizeColors}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-all"
            >
              <Sparkles className="h-3 w-3" /> Palette
            </button>
          </div>

          {/* Wall Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Wall Color</span>
              <input
                type="color"
                value={config.wallColor}
                onChange={(e) => onChangeConfig({ wallColor: e.target.value })}
                className="h-5 w-7 cursor-pointer rounded bg-transparent border-0"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {wallSwatches.map((hex) => (
                <button
                  key={`wall-${hex}`}
                  onClick={() => onChangeConfig({ wallColor: hex })}
                  className={`h-5 flex-1 rounded-md border transition-all ${
                    config.wallColor === hex ? 'border-emerald-400 scale-110' : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Window Glass Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Window Glass Tint</span>
              <input
                type="color"
                value={config.windowColor}
                onChange={(e) => onChangeConfig({ windowColor: e.target.value })}
                className="h-5 w-7 cursor-pointer rounded bg-transparent border-0"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {windowSwatches.map((hex) => (
                <button
                  key={`win-${hex}`}
                  onClick={() => onChangeConfig({ windowColor: hex })}
                  className={`h-5 flex-1 rounded-md border transition-all ${
                    config.windowColor === hex ? 'border-emerald-400 scale-110' : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Trim / Accent Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Trim & Slab Accent</span>
              <input
                type="color"
                value={config.trimColor}
                onChange={(e) => onChangeConfig({ trimColor: e.target.value })}
                className="h-5 w-7 cursor-pointer rounded bg-transparent border-0"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {trimSwatches.map((hex) => (
                <button
                  key={`trim-${hex}`}
                  onClick={() => onChangeConfig({ trimColor: hex })}
                  className={`h-5 flex-1 rounded-md border transition-all ${
                    config.trimColor === hex ? 'border-emerald-400 scale-110' : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-700/50 pt-3">
          <button
            onClick={onResetView}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800/90 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-slate-700"
          >
            <RotateCcw className="h-4 w-4" /> Reset View & Defaults
          </button>
        </div>

      </div>
    </div>
  );
};
