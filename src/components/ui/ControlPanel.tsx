import React, { useState } from 'react';
import {
  Layers,
  CheckSquare,
  Square,
  RotateCw,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  Sliders,
  Building2,
  Trees,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Grid,
  Maximize2,
  Sun,
  Zap,
} from 'lucide-react';
import {
  SiteBuilding,
  SiteElement,
  SelectedItemRef,
  BuildingConfig,
  SiteConfig,
} from '../../types/building';

interface ControlPanelProps {
  buildings: SiteBuilding[];
  elements: SiteElement[];
  siteConfig: SiteConfig;
  selectedItem: SelectedItemRef | null;
  onUpdateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  onUpdateBuildingConfig: (id: string, newConfig: Partial<BuildingConfig>) => void;
  onUpdateBuildingDimensions: (id: string, width: number, depth: number) => void;
  onUpdateElementDimensions: (id: string, width: number, depth: number) => void;
  onUpdateElementLightProps: (
    id: string,
    lightProps: { lightColor?: string; lightIntensity?: number; headType?: 'single' | 'double' | 'quad'; width?: number }
  ) => void;
  onUpdateBuildingName: (id: string, name: string) => void;
  onUpdateElementName: (id: string, name: string) => void;
  onNudgePosition: (id: string, type: 'building' | 'element', deltaX: number, deltaZ: number) => void;
  onRotateItemAngle: (id: string, type: 'building' | 'element', deltaDegrees: number) => void;
  onDuplicateItem: (id: string, type: 'building' | 'element') => void;
  onDeleteItem: (id: string, type: 'building' | 'element') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  buildings,
  elements,
  siteConfig,
  selectedItem,
  onUpdateSiteConfig,
  onUpdateBuildingConfig,
  onUpdateBuildingDimensions,
  onUpdateElementDimensions,
  onUpdateElementLightProps,
  onUpdateBuildingName,
  onUpdateElementName,
  onNudgePosition,
  onRotateItemAngle,
  onDuplicateItem,
  onDeleteItem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const selectedBuilding =
    selectedItem?.type === 'building'
      ? buildings.find((b) => b.id === selectedItem.id)
      : null;

  const selectedElement =
    selectedItem?.type === 'element'
      ? elements.find((e) => e.id === selectedItem.id)
      : null;

  const wallSwatches = ['#e2e8f0', '#f1f5f9', '#334155', '#78350f', '#0f172a', '#d97706'];
  const lampColorSwatches = ['#fbbf24', '#fef08a', '#e0f2fe', '#38bdf8', '#c084fc', '#34d399'];

  const stepSize = siteConfig.gridSnap ? siteConfig.snapSize : 2;

  return (
    <div
      className={`absolute top-36 left-4 z-20 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[-105%]' : 'translate-x-0'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-9 top-4 flex h-9 w-9 items-center justify-center rounded-r-xl glass-panel text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl border-l-0"
        title={isCollapsed ? 'Expand Control Panel' : 'Collapse Control Panel'}
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      <div className="glass-panel w-80 max-h-[72vh] overflow-y-auto rounded-2xl p-4 shadow-2xl flex flex-col gap-4 text-slate-100 border border-slate-700/60">
        
        {/* Selected Building Controls */}
        {selectedBuilding && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={selectedBuilding.name}
                  onChange={(e) => onUpdateBuildingName(selectedBuilding.id, e.target.value)}
                  className="bg-transparent font-bold text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1 border border-slate-700/60"
                />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                SELECTED
              </span>
            </div>

            {/* Custom Building Footprint Dimensions */}
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-emerald-400" /> Custom Footprint
                </span>
                <span className="text-emerald-400 font-bold text-[11px]">
                  {selectedBuilding.config.width || 16}m × {selectedBuilding.config.depth || 10}m
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Width (X Axis)</span>
                  <span className="font-semibold text-white">{selectedBuilding.config.width || 16} m</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={2}
                  value={selectedBuilding.config.width || 16}
                  onChange={(e) =>
                    onUpdateBuildingDimensions(
                      selectedBuilding.id,
                      parseInt(e.target.value),
                      selectedBuilding.config.depth || 10
                    )
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Depth (Z Axis)</span>
                  <span className="font-semibold text-white">{selectedBuilding.config.depth || 10} m</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={30}
                  step={2}
                  value={selectedBuilding.config.depth || 10}
                  onChange={(e) =>
                    onUpdateBuildingDimensions(
                      selectedBuilding.id,
                      selectedBuilding.config.width || 16,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Position Nudge Controls */}
            <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Nudge Position</span>
                <span className="text-[10px] text-slate-400">
                  X: {selectedBuilding.position[0].toFixed(0)}m | Z: {selectedBuilding.position[2].toFixed(0)}m
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => onNudgePosition(selectedBuilding.id, 'building', -stepSize, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onNudgePosition(selectedBuilding.id, 'building', 0, -stepSize)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onNudgePosition(selectedBuilding.id, 'building', 0, stepSize)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => onNudgePosition(selectedBuilding.id, 'building', stepSize, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center justify-between gap-1.5 text-xs">
              <button
                onClick={() => onRotateItemAngle(selectedBuilding.id, 'building', -90)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> -90°
              </button>
              <button
                onClick={() => onRotateItemAngle(selectedBuilding.id, 'building', 45)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCw className="h-3.5 w-3.5" /> +45°
              </button>
              <button
                onClick={() => onRotateItemAngle(selectedBuilding.id, 'building', 90)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCw className="h-3.5 w-3.5" /> +90°
              </button>
            </div>

            {/* Floors Stepper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" /> Building Floors
                </span>
                <span className="text-emerald-400 font-bold">
                  {(4.2 + (selectedBuilding.config.floors - 1) * 3.2).toFixed(1)} m
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 ml-2">Floors</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      onUpdateBuildingConfig(selectedBuilding.id, {
                        floors: Math.max(1, selectedBuilding.config.floors - 1),
                      })
                    }
                    disabled={selectedBuilding.config.floors <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-6 text-center text-base font-extrabold text-white">
                    {selectedBuilding.config.floors}
                  </span>

                  <button
                    onClick={() =>
                      onUpdateBuildingConfig(selectedBuilding.id, {
                        floors: Math.min(10, selectedBuilding.config.floors + 1),
                      })
                    }
                    disabled={selectedBuilding.config.floors >= 10}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 border-t border-slate-700/50 pt-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Wall Color</span>
                  <input
                    type="color"
                    value={selectedBuilding.config.wallColor}
                    onChange={(e) =>
                      onUpdateBuildingConfig(selectedBuilding.id, { wallColor: e.target.value })
                    }
                    className="h-5 w-7 cursor-pointer rounded bg-transparent border-0"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {wallSwatches.map((hex) => (
                    <button
                      key={`wall-${hex}`}
                      onClick={() =>
                        onUpdateBuildingConfig(selectedBuilding.id, { wallColor: hex })
                      }
                      className={`h-5 flex-1 rounded-md border transition-all ${
                        selectedBuilding.config.wallColor === hex ? 'border-emerald-400 scale-110' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-700/50 pt-3">
              <button
                onClick={() => onDuplicateItem(selectedBuilding.id, 'building')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" /> Duplicate
              </button>

              <button
                onClick={() => onDeleteItem(selectedBuilding.id, 'building')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-900/40 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-800/60 border border-rose-700/40"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Selected Site Element Controls */}
        {selectedElement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <div className="flex items-center gap-2">
                <Trees className="h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) => onUpdateElementName(selectedElement.id, e.target.value)}
                  className="bg-transparent font-bold text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1 border border-slate-700/60"
                />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                {selectedElement.type}
              </span>
            </div>

            {/* Specialized Controls for Street Lamp Customization */}
            {selectedElement.type === 'street_light' && (
              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-amber-400" /> Street Lamp Settings
                  </span>
                  <span className="text-amber-400 font-bold text-[11px]">
                    {selectedElement.width || 5.5}m Height
                  </span>
                </div>

                {/* Pole Height Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Pole Height</span>
                    <span className="font-semibold text-white">{selectedElement.width || 5.5} m</span>
                  </div>
                  <input
                    type="range"
                    min={4.0}
                    max={12.0}
                    step={0.5}
                    value={selectedElement.width || 5.5}
                    onChange={(e) =>
                      onUpdateElementLightProps(selectedElement.id, {
                        width: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Fixture Head Configuration */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-300 block font-medium">Fixture Heads</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'single', label: 'Single' },
                      { id: 'double', label: 'Double' },
                      { id: 'quad', label: 'Quad Mast' },
                    ].map((head) => (
                      <button
                        key={`head-${head.id}`}
                        onClick={() =>
                          onUpdateElementLightProps(selectedElement.id, {
                            headType: head.id as 'single' | 'double' | 'quad',
                          })
                        }
                        className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                          (selectedElement.headType || 'single') === head.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {head.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Light Bulb Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Light Color Tint</span>
                    <input
                      type="color"
                      value={selectedElement.lightColor || '#fbbf24'}
                      onChange={(e) =>
                        onUpdateElementLightProps(selectedElement.id, {
                          lightColor: e.target.value,
                        })
                      }
                      className="h-5 w-7 cursor-pointer rounded bg-transparent border-0"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lampColorSwatches.map((hex) => (
                      <button
                        key={`lamp-color-${hex}`}
                        onClick={() =>
                          onUpdateElementLightProps(selectedElement.id, { lightColor: hex })
                        }
                        className={`h-5 flex-1 rounded-md border transition-all ${
                          (selectedElement.lightColor || '#fbbf24') === hex
                            ? 'border-amber-400 scale-110'
                            : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Light Intensity Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" /> Illumination Brightness
                    </span>
                    <span className="font-semibold text-white">
                      {selectedElement.lightIntensity !== undefined ? selectedElement.lightIntensity : 18}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={2}
                    value={selectedElement.lightIntensity !== undefined ? selectedElement.lightIntensity : 18}
                    onChange={(e) =>
                      onUpdateElementLightProps(selectedElement.id, {
                        lightIntensity: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Custom Measurements for Parking, Pool, Park, Road, Clubhouse */}
            {['parking', 'pool', 'park', 'road', 'clubhouse'].includes(selectedElement.type) && (
              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-emerald-400" /> Custom Measurement
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {(selectedElement.width || 16) * (selectedElement.depth || 14)} m² Area
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Width / Length</span>
                    <span className="font-semibold text-white">{selectedElement.width || 16} m</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={60}
                    step={2}
                    value={selectedElement.width || 16}
                    onChange={(e) =>
                      onUpdateElementDimensions(
                        selectedElement.id,
                        parseInt(e.target.value),
                        selectedElement.depth || 14
                      )
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Depth / Width</span>
                    <span className="font-semibold text-white">{selectedElement.depth || 14} m</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    step={2}
                    value={selectedElement.depth || 14}
                    onChange={(e) =>
                      onUpdateElementDimensions(
                        selectedElement.id,
                        selectedElement.width || 16,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Position Nudge Controls */}
            <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Nudge Position</span>
                <span className="text-[10px] text-slate-400">
                  X: {selectedElement.position[0].toFixed(0)}m | Z: {selectedElement.position[2].toFixed(0)}m
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => onNudgePosition(selectedElement.id, 'element', -stepSize, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onNudgePosition(selectedElement.id, 'element', 0, -stepSize)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onNudgePosition(selectedElement.id, 'element', 0, stepSize)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => onNudgePosition(selectedElement.id, 'element', stepSize, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center justify-between gap-1.5 text-xs">
              <button
                onClick={() => onRotateItemAngle(selectedElement.id, 'element', -90)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> -90°
              </button>
              <button
                onClick={() => onRotateItemAngle(selectedElement.id, 'element', 45)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCw className="h-3.5 w-3.5" /> +45°
              </button>
              <button
                onClick={() => onRotateItemAngle(selectedElement.id, 'element', 90)}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                <RotateCw className="h-3.5 w-3.5" /> +90°
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-700/50 pt-3">
              <button
                onClick={() => onDuplicateItem(selectedElement.id, 'element')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" /> Duplicate
              </button>

              <button
                onClick={() => onDeleteItem(selectedElement.id, 'element')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-900/40 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-800/60 border border-rose-700/40"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Global Settings when nothing is selected */}
        {!selectedBuilding && !selectedElement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">
                  Plot Grid & Custom Dimensions
                </h2>
              </div>
            </div>

            {/* Interactive Boundary & Arena Size Section */}
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="h-4 w-4 text-emerald-400" /> Arena Boundary Size
                </span>
                <span className="text-emerald-400 font-mono">
                  {siteConfig.plotSize[0]}m × {siteConfig.plotSize[1]}m
                </span>
              </div>

              {/* Range Slider for Arena Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Standard (200m)</span>
                  <span>Large (500m)</span>
                  <span>Mega Arena (1500m)</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={50}
                  value={siteConfig.plotSize[0]}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    onUpdateSiteConfig({ plotSize: [newSize, newSize] });
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Quick Presets Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[200, 500, 800, 1200].map((presetVal) => {
                  const isActive = siteConfig.plotSize[0] === presetVal;
                  return (
                    <button
                      key={`plot-preset-${presetVal}`}
                      onClick={() => onUpdateSiteConfig({ plotSize: [presetVal, presetVal] })}
                      className={`rounded-lg py-1.5 text-[11px] font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {presetVal}m
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Snap to Grid Alignment Toggle */}
            <button
              onClick={() => onUpdateSiteConfig({ gridSnap: !siteConfig.gridSnap })}
              className="flex w-full items-center justify-between rounded-xl bg-slate-900/60 p-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 border border-slate-800"
            >
              <span className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-emerald-400" /> Snap to Grid Alignment
              </span>
              <span className={siteConfig.gridSnap ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {siteConfig.gridSnap ? `ON (${siteConfig.snapSize}m)` : 'OFF'}
              </span>
            </button>

            {/* Perimeter Wall Toggle */}
            <button
              onClick={() => onUpdateSiteConfig({ showBoundaryWall: !siteConfig.showBoundaryWall })}
              className="flex w-full items-center justify-between rounded-xl bg-slate-900/60 p-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 border border-slate-800"
            >
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" /> Show Perimeter Boundary Wall
              </span>
              <span className={siteConfig.showBoundaryWall ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {siteConfig.showBoundaryWall ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </button>
          </div>
        )}


      </div>
    </div>
  );
};
