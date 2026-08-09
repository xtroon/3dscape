import React from 'react';
import { Building2, Sun, Sunset, Moon, Camera, Grid, Shield } from 'lucide-react';
import { SiteConfig, TimeOfDay } from '../../types/building';

interface HeaderProps {
  siteConfig: SiteConfig;
  onChangeSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  onCaptureScreenshot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteConfig,
  onChangeSiteConfig,
  onCaptureScreenshot,
}) => {
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
      {/* Brand Positioning & Project Info */}
      <div className="glass-panel pointer-events-auto flex items-center gap-3.5 rounded-2xl px-4 py-2.5 shadow-xl border border-slate-700/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20">
          <Building2 className="h-5 w-5 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              BuildView <span className="text-emerald-400">3D</span>
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              SITE PLANNER
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300">
            Design your entire property before you build it.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Toggle Grid Lines */}
        <button
          onClick={() => onChangeSiteConfig({ showGridLines: !siteConfig.showGridLines })}
          title="Toggle plot alignment grid lines"
          className={`glass-pill flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
            siteConfig.showGridLines
              ? 'bg-emerald-600/80 text-white border-emerald-500/40'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Grid className="h-4 w-4" />
          <span className="hidden md:inline">Grid</span>
        </button>

        {/* Toggle Boundary Wall */}
        <button
          onClick={() => onChangeSiteConfig({ showBoundaryWall: !siteConfig.showBoundaryWall })}
          title="Toggle perimeter boundary wall"
          className={`glass-pill flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
            siteConfig.showBoundaryWall
              ? 'bg-emerald-600/80 text-white border-emerald-500/40'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span className="hidden md:inline">Boundary Wall</span>
        </button>

        {/* Time of Day Toggle */}
        <button
          onClick={() => onChangeSiteConfig({ timeOfDay: nextTimeOfDay[siteConfig.timeOfDay] })}
          title={`Lighting mode: ${timeIcons[siteConfig.timeOfDay].label}`}
          className="glass-pill flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-all active:scale-95"
        >
          {timeIcons[siteConfig.timeOfDay].icon}
          <span className="hidden sm:inline">{timeIcons[siteConfig.timeOfDay].label}</span>
        </button>

        {/* Snapshot Tool */}
        <button
          onClick={onCaptureScreenshot}
          title="Capture HD site snapshot"
          className="glass-pill flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 border-emerald-500/40"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Snapshot</span>
        </button>
      </div>
    </header>
  );
};
