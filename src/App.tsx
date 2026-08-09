import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

import { BuildingConfig, CameraPreset } from './types/building';
import { BuildingScene } from './components/3d/BuildingScene';
import { Header } from './components/ui/Header';
import { ControlPanel } from './components/ui/ControlPanel';
import { ViewPresetsBar } from './components/ui/ViewPresetsBar';
import { BuildingInfoCard } from './components/ui/BuildingInfoCard';

const defaultConfig: BuildingConfig = {
  floors: 5,
  showWindows: true,
  showBalconies: true,
  showParking: true,
  showStreetLights: true,
  wallColor: '#f1f5f9',
  windowColor: '#38bdf8',
  trimColor: '#1e293b',
  roofColor: '#334155',
  balconyColor: '#38bdf8',
  timeOfDay: 'day',
  propertyName: 'Green Residency',
  propertySubtitle: '5 Floors • Premium Apartments',
};

// Preset architectural color palettes
const colorPalettes = [
  { wall: '#f1f5f9', win: '#38bdf8', trim: '#1e293b', roof: '#334155', balcony: '#38bdf8' }, // Modern Nordic White
  { wall: '#e2e8f0', win: '#0284c7', trim: '#0f172a', roof: '#1e293b', balcony: '#0284c7' }, // Slate & Sapphire
  { wall: '#fef3c7', win: '#38bdf8', trim: '#78350f', roof: '#451a03', balcony: '#f59e0b' }, // Warm Sandstone
  { wall: '#334155', win: '#7dd3fc', trim: '#e2e8f0', roof: '#0f172a', balcony: '#7dd3fc' }, // Dark Urban Charcoal
  { wall: '#dcfce7', win: '#38bdf8', trim: '#14532d', roof: '#064e3b', balcony: '#34d399' }, // Eco Green Oasis
];

export const App: React.FC = () => {
  const [config, setConfig] = useState<BuildingConfig>(defaultConfig);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('street');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConfigChange = (newPartial: Partial<BuildingConfig>) => {
    setConfig((prev) => ({ ...prev, ...newPartial }));
  };

  const handleResetView = () => {
    setConfig(defaultConfig);
    setCameraPreset('street');
  };

  const handleRandomizeColors = () => {
    const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    setConfig((prev) => ({
      ...prev,
      wallColor: randomPalette.wall,
      windowColor: randomPalette.win,
      trimColor: randomPalette.trim,
      roofColor: randomPalette.roof,
      balconyColor: randomPalette.balcony,
    }));
  };

  const handleCaptureScreenshot = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BuildView3D_${config.propertyName.replace(/\s+/g, '_')}_${config.floors}Floors.png`;
      link.href = dataUrl;
      link.click();

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Header Overlay */}
      <Header
        config={config}
        onChangeConfig={handleConfigChange}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* Floating Control Panel */}
      <ControlPanel
        config={config}
        onChangeConfig={handleConfigChange}
        onResetView={handleResetView}
        onRandomizeColors={handleRandomizeColors}
      />

      {/* Real Estate Info Specs Card */}
      <BuildingInfoCard config={config} />

      {/* Main 3D Canvas Scene */}
      <BuildingScene
        config={config}
        preset={cameraPreset}
        canvasRef={canvasRef}
      />

      {/* Bottom Center Camera View Presets Bar */}
      <ViewPresetsBar
        currentPreset={cameraPreset}
        onSelectPreset={setCameraPreset}
        onResetView={handleResetView}
      />
    </div>
  );
};

export default App;
