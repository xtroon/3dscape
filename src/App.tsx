import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

import {
  SiteBuilding,
  SiteElement,
  SiteConfig,
  CameraPreset,
  SelectedItemRef,
  BuildingConfig,
  PlacementTool,
} from './types/building';

import { BuildingScene } from './components/3d/BuildingScene';
import { Header } from './components/ui/Header';
import { SitePlannerToolbar } from './components/ui/SitePlannerToolbar';
import { ControlPanel } from './components/ui/ControlPanel';
import { SiteObjectList } from './components/ui/SiteObjectList';
import { ViewPresetsBar } from './components/ui/ViewPresetsBar';

const defaultBuildingConfig: BuildingConfig = {
  floors: 6,
  width: 16,
  depth: 10,
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
  propertyName: 'Green Horizon Residency',
  propertySubtitle: 'Master Residential Community Planner',
};

const initialBuildings: SiteBuilding[] = [
  {
    id: 'b-1',
    name: 'Building A',
    position: [-25, 0, -20],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 8, width: 20, depth: 12, wallColor: '#f1f5f9' },
  },
  {
    id: 'b-2',
    name: 'Building B',
    position: [25, 0, -20],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 5, width: 16, depth: 10, wallColor: '#e2e8f0', windowColor: '#0284c7' },
  },
  {
    id: 'b-3',
    name: 'Building C',
    position: [-25, 0, 25],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 6, width: 24, depth: 14, wallColor: '#334155', trimColor: '#e2e8f0' },
  },
];

const initialElements: SiteElement[] = [
  {
    id: 'el-road-1',
    type: 'road',
    name: 'Internal Main Road',
    position: [0, 0, 0],
    rotationY: 0,
    width: 60,
    depth: 8,
  },
  {
    id: 'el-park-1',
    type: 'park',
    name: 'Central Green Park',
    position: [0, 0, 32],
    rotationY: 0,
    width: 24,
    depth: 24,
  },
  {
    id: 'el-pool-1',
    type: 'pool',
    name: 'Community Swimming Pool',
    position: [-25, 0, 55],
    rotationY: 0,
    width: 18,
    depth: 12,
  },
  {
    id: 'el-parking-1',
    type: 'parking',
    name: 'Resident Parking Lot',
    position: [25, 0, 32],
    rotationY: 0,
    width: 24,
    depth: 16,
  },
  {
    id: 'el-clubhouse-1',
    type: 'clubhouse',
    name: 'Grand Clubhouse',
    position: [0, 0, -50],
    rotationY: 0,
    width: 18,
    depth: 12,
  },
  {
    id: 'el-lamp-1',
    type: 'street_light',
    name: 'Street Lamp 1',
    position: [-10, 0, 8],
    rotationY: 0,
    width: 5.5,
    lightColor: '#fbbf24',
    lightIntensity: 18,
    headType: 'single',
  },
  {
    id: 'el-lamp-2',
    type: 'street_light',
    name: 'Street Lamp 2',
    position: [10, 0, 8],
    rotationY: 0,
    width: 6.5,
    lightColor: '#38bdf8',
    lightIntensity: 24,
    headType: 'double',
  },
];

const defaultSiteConfig: SiteConfig = {
  propertyName: 'Green Horizon Estate',
  propertySubtitle: 'Master Residential Community',
  timeOfDay: 'day',
  showBoundaryWall: true,
  showGridLines: true,
  gridSnap: true,
  snapSize: 2,
  plotSize: [200, 200],
};

export const App: React.FC = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [buildings, setBuildings] = useState<SiteBuilding[]>(initialBuildings);
  const [elements, setElements] = useState<SiteElement[]>(initialElements);
  const [selectedItem, setSelectedItem] = useState<SelectedItemRef | null>({
    id: 'b-1',
    type: 'building',
  });
  const [placementTool, setPlacementTool] = useState<PlacementTool>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('top_site');
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ESC shortcut to cancel placement mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlacementTool(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFocusSelectedItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'building') {
      const target = buildings.find((b) => b.id === selectedItem.id);
      if (target) setFocusTarget([...target.position]);
    } else {
      const target = elements.find((e) => e.id === selectedItem.id);
      if (target) setFocusTarget([...target.position]);
    }
  };

  const handlePlaceObjectAt = (pos: [number, number, number]) => {
    if (!placementTool) return;

    if (placementTool === 'building') {
      const nextChar = String.fromCharCode(65 + buildings.length);
      const newId = `b-${Date.now()}`;
      const newBuilding: SiteBuilding = {
        id: newId,
        name: `Building ${nextChar}`,
        position: pos,
        rotationY: 0,
        config: { ...defaultBuildingConfig, floors: 5, width: 16, depth: 10 },
      };
      setBuildings((prev) => [...prev, newBuilding]);
      setSelectedItem({ id: newId, type: 'building' });
    } else {
      const typeNames: Record<string, string> = {
        road: 'Internal Road',
        park: 'Green Park',
        parking: 'Parking Bays',
        tree: 'Garden Tree',
        pool: 'Swimming Pool',
        clubhouse: 'Clubhouse',
        street_light: 'Street Lamp',
      };

      const defaultDims: Record<string, { w: number; d: number }> = {
        parking: { w: 20, d: 14 },
        pool: { w: 16, d: 10 },
        park: { w: 20, d: 20 },
        road: { w: 30, d: 8 },
        clubhouse: { w: 16, d: 12 },
        street_light: { w: 5.5, d: 1 },
      };

      const dims = defaultDims[placementTool] || { w: 14, d: 10 };

      const newId = `el-${Date.now()}`;
      const newEl: SiteElement = {
        id: newId,
        type: placementTool,
        name: `${typeNames[placementTool] || placementTool} ${elements.length + 1}`,
        position: pos,
        rotationY: 0,
        width: dims.w,
        depth: dims.d,
        lightColor: placementTool === 'street_light' ? '#fbbf24' : undefined,
        lightIntensity: placementTool === 'street_light' ? 18 : undefined,
        headType: placementTool === 'street_light' ? 'single' : undefined,
      };

      setElements((prev) => [...prev, newEl]);
      setSelectedItem({ id: newId, type: 'element' });
    }

    setPlacementTool(null);
  };

  const handleUpdateBuildingConfig = (id: string, newConfig: Partial<BuildingConfig>) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, config: { ...b.config, ...newConfig } } : b))
    );
  };

  const handleUpdateBuildingDimensions = (id: string, width: number, depth: number) => {
    setBuildings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, config: { ...b.config, width, depth } } : b
      )
    );
  };

  const handleUpdateElementDimensions = (id: string, width: number, depth: number) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, width, depth } : e))
    );
  };

  const handleUpdateElementLightProps = (
    id: string,
    lightProps: { lightColor?: string; lightIntensity?: number; headType?: 'single' | 'double' | 'quad'; width?: number }
  ) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...lightProps } : e))
    );
  };

  const handleUpdateBuildingName = (id: string, name: string) => {
    setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
  };

  const handleUpdateElementName = (id: string, name: string) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)));
  };

  const handleUpdateTransform = (
    id: string,
    type: 'building' | 'element',
    newPos: [number, number, number],
    newRotY: number
  ) => {
    if (type === 'building') {
      setBuildings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, position: newPos, rotationY: newRotY } : b))
      );
    } else {
      setElements((prev) =>
        prev.map((e) => (e.id === id ? { ...e, position: newPos, rotationY: newRotY } : e))
      );
    }
  };

  const handleNudgePosition = (
    id: string,
    type: 'building' | 'element',
    deltaX: number,
    deltaZ: number
  ) => {
    if (type === 'building') {
      setBuildings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                position: [b.position[0] + deltaX, b.position[1], b.position[2] + deltaZ],
              }
            : b
        )
      );
    } else {
      setElements((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                position: [e.position[0] + deltaX, e.position[1], e.position[2] + deltaZ],
              }
            : e
        )
      );
    }
  };

  const handleRotateItemAngle = (
    id: string,
    type: 'building' | 'element',
    deltaDegrees: number
  ) => {
    const deltaRad = (deltaDegrees * Math.PI) / 180;
    if (type === 'building') {
      setBuildings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, rotationY: b.rotationY + deltaRad } : b))
      );
    } else {
      setElements((prev) =>
        prev.map((e) => (e.id === id ? { ...e, rotationY: e.rotationY + deltaRad } : e))
      );
    }
  };

  const handleDuplicateItem = (id: string, type: 'building' | 'element') => {
    if (type === 'building') {
      const target = buildings.find((b) => b.id === id);
      if (!target) return;
      const newId = `b-${Date.now()}`;
      const clone: SiteBuilding = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        position: [target.position[0] + 18, 0, target.position[2] + 12],
      };
      setBuildings((prev) => [...prev, clone]);
      setSelectedItem({ id: newId, type: 'building' });
    } else {
      const target = elements.find((e) => e.id === id);
      if (!target) return;
      const newId = `el-${Date.now()}`;
      const clone: SiteElement = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        position: [target.position[0] + 12, 0, target.position[2] + 10],
      };
      setElements((prev) => [...prev, clone]);
      setSelectedItem({ id: newId, type: 'element' });
    }
  };

  const handleDeleteItem = (id: string, type: 'building' | 'element') => {
    if (type === 'building') {
      setBuildings((prev) => prev.filter((b) => b.id !== id));
    } else {
      setElements((prev) => prev.filter((e) => e.id !== id));
    }
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleResetView = () => {
    setSiteConfig(defaultSiteConfig);
    setBuildings(initialBuildings);
    setElements(initialElements);
    setSelectedItem({ id: 'b-1', type: 'building' });
    setPlacementTool(null);
    setFocusTarget(null);
    setCameraPreset('top_site');
  };

  const handleCaptureScreenshot = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BuildView3D_SitePlanner_${buildings.length}Buildings.png`;
      link.href = dataUrl;
      link.click();

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
        siteConfig={siteConfig}
        onChangeSiteConfig={(newPartial) => setSiteConfig((prev) => ({ ...prev, ...newPartial }))}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* Top Creation Toolbar */}
      <SitePlannerToolbar
        placementTool={placementTool}
        onSelectPlacementTool={setPlacementTool}
      />

      {/* Selected Item Control Panel */}
      <ControlPanel
        buildings={buildings}
        elements={elements}
        siteConfig={siteConfig}
        selectedItem={selectedItem}
        onUpdateSiteConfig={(newPartial) => setSiteConfig((prev) => ({ ...prev, ...newPartial }))}
        onUpdateBuildingConfig={handleUpdateBuildingConfig}
        onUpdateBuildingDimensions={handleUpdateBuildingDimensions}
        onUpdateElementDimensions={handleUpdateElementDimensions}
        onUpdateElementLightProps={handleUpdateElementLightProps}
        onUpdateBuildingName={handleUpdateBuildingName}
        onUpdateElementName={handleUpdateElementName}
        onNudgePosition={handleNudgePosition}
        onRotateItemAngle={handleRotateItemAngle}
        onDuplicateItem={handleDuplicateItem}
        onDeleteItem={handleDeleteItem}
      />

      {/* Right Outliner Inventory */}
      <SiteObjectList
        buildings={buildings}
        elements={elements}
        selectedItem={selectedItem}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setPlacementTool(null);
          setFocusTarget(null);
        }}
        onDuplicateItem={handleDuplicateItem}
        onDeleteItem={handleDeleteItem}
      />

      {/* Main Interactive 3D Canvas Scene */}
      <BuildingScene
        buildings={buildings}
        elements={elements}
        siteConfig={siteConfig}
        preset={cameraPreset}
        selectedItem={selectedItem}
        placementTool={placementTool}
        focusTarget={focusTarget}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setFocusTarget(null);
          if (item) setPlacementTool(null);
        }}
        onUpdateTransform={handleUpdateTransform}
        onPlaceObjectAt={handlePlaceObjectAt}
        canvasRef={canvasRef}
      />

      {/* Bottom Camera View Presets Bar */}
      <ViewPresetsBar
        currentPreset={cameraPreset}
        hasSelectedItem={selectedItem !== null}
        onSelectPreset={(p) => {
          setCameraPreset(p);
          setFocusTarget(null);
        }}
        onFocusSelectedItem={handleFocusSelectedItem}
        onResetView={handleResetView}
      />
    </div>
  );
};

export default App;
