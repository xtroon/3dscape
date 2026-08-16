import React from 'react';
import { Sun, Sunset, Moon, Camera, Grid, Shield, LayoutDashboard, Check } from 'lucide-react';
import { SiteConfig, TimeOfDay } from '../../types/building';

interface HeaderProps {
  siteConfig: SiteConfig;
  onChangeSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  onCaptureScreenshot: () => void;
  onBackToLanding: () => void;
  projectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  siteConfig,
  onChangeSiteConfig,
  onCaptureScreenshot,
  onBackToLanding,
  projectName,
}) => {
  const timeIcons: Record<TimeOfDay, { icon: React.ReactNode; label: string }> = {
    day: { icon: <Sun className="h-3.5 w-3.5 text-zinc-700" />, label: 'Day' },
    sunset: { icon: <Sunset className="h-3.5 w-3.5 text-zinc-700" />, label: 'Sunset' },
    night: { icon: <Moon className="h-3.5 w-3.5 text-zinc-700" />, label: 'Night' },
  };

  const nextTimeOfDay: Record<TimeOfDay, TimeOfDay> = {
    day: 'sunset',
    sunset: 'night',
    night: 'day',
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Brand & Project Info */}
      <div className="pointer-events-auto flex items-center gap-3 bg-white/95 backdrop-blur border border-zinc-200 rounded px-3 py-2 shadow-sm text-zinc-900">
        <button
          onClick={onBackToLanding}
          title="Return to Projects Dashboard"
          className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 text-white font-mono font-bold text-xs hover:bg-black transition-colors"
        >
          3D
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-bold text-zinc-900">
              {projectName || '3DScape Project'}
            </h1>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              <Check className="h-3 w-3 text-zinc-600" /> Saved
            </span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">
            {siteConfig.plotSize[0]}m × {siteConfig.plotSize[1]}m
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Return to Dashboard */}
        <button
          onClick={onBackToLanding}
          title="Return to Projects Dashboard"
          className="flex items-center gap-1.5 rounded bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-zinc-700" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Toggle Grid Lines */}
        <button
          onClick={() => onChangeSiteConfig({ showGridLines: !siteConfig.showGridLines })}
          title="Toggle plot grid lines"
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors border shadow-sm ${
            siteConfig.showGridLines
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Grid className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Grid</span>
        </button>

        {/* Toggle Boundary Wall */}
        <button
          onClick={() => onChangeSiteConfig({ showBoundaryWall: !siteConfig.showBoundaryWall })}
          title="Toggle boundary wall"
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors border shadow-sm ${
            siteConfig.showBoundaryWall
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Boundary</span>
        </button>

        {/* Time of Day Toggle */}
        <button
          onClick={() => onChangeSiteConfig({ timeOfDay: nextTimeOfDay[siteConfig.timeOfDay] })}
          title={`Lighting mode: ${timeIcons[siteConfig.timeOfDay].label}`}
          className="flex items-center gap-1.5 rounded bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
        >
          {timeIcons[siteConfig.timeOfDay].icon}
          <span className="hidden sm:inline">{timeIcons[siteConfig.timeOfDay].label}</span>
        </button>

        {/* Snapshot Tool */}
        <button
          onClick={onCaptureScreenshot}
          title="Capture HD site snapshot"
          className="flex items-center gap-1.5 rounded bg-zinc-900 hover:bg-black text-white px-3.5 py-1.5 text-xs font-medium shadow-sm transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Snapshot</span>
        </button>
      </div>
    </header>
  );
};


