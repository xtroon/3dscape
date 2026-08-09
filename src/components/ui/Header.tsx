import React from 'react';
import { Building2, Sun, Sunset, Moon, Camera, Sparkles } from 'lucide-react';
import { BuildingConfig, TimeOfDay } from '../../types/building';

interface HeaderProps {
  config: BuildingConfig;
  onChangeConfig: (newConfig: Partial<BuildingConfig>) => void;
  onCaptureScreenshot: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onChangeConfig, onCaptureScreenshot }) => {
  const timeIcons: Record<TimeOfDay, { icon: React.ReactNode; label: string }> = {
    day: { icon: <Sun className="h-4 w-4 text-amber-400" />, label: 'Day' },
    sunset: { icon: <Sunset className="h-4 w-4 text-orange-400" />, label: 'Sunset' },
    night: { icon: <Moon className="h-4 w-4 text-blue-400" />, label: 'Night' },
  };

  const nextTimeOfDay: Record<TimeOfDay, TimeOfDay> = {
    day: 'sunset',
    sunset: 'night',
    night: 'day',
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Brand & Project Info */}
      <div className="glass-panel pointer-events-auto flex items-center gap-3.5 rounded-2xl px-4 py-2.5 shadow-xl transition-all hover:border-emerald-500/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20">
          <Building2 className="h-5 w-5 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">BuildView <span className="text-emerald-400">3D</span></h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-2.5 w-2.5" /> PRO
            </span>
          </div>
          <p className="text-xs font-medium text-slate-300">
            {config.propertyName} • <span className="text-emerald-400 font-semibold">{config.floors} Floors</span> • Premium Apartments
          </p>
        </div>
      </div>

      {/* Top Right Quick Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Time of Day Switcher */}
        <button
          onClick={() => onChangeConfig({ timeOfDay: nextTimeOfDay[config.timeOfDay] })}
          title={`Switch lighting mode (Current: ${timeIcons[config.timeOfDay].label})`}
          className="glass-pill flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-white transition-all active:scale-95"
        >
          {timeIcons[config.timeOfDay].icon}
          <span className="hidden sm:inline">{timeIcons[config.timeOfDay].label} Mode</span>
        </button>

        {/* Screenshot Button */}
        <button
          onClick={onCaptureScreenshot}
          title="Capture HD snapshot of 3D building"
          className="glass-pill flex items-center gap-2 rounded-xl bg-emerald-600/80 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 border-emerald-500/40"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Capture Snapshot</span>
        </button>
      </div>
    </header>
  );
};
