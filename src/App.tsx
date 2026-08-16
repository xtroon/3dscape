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
import { LandingPage } from './components/ui/LandingPage';
import {
  projectManager,
  ProjectData,
  createDefaultInitialBuildings,
  createDefaultInitialElements,
  createDefaultSiteConfig,
} from './utils/projectManager';


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

const defaultSiteConfig: SiteConfig = createDefaultSiteConfig();


export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'planner'>('landing');
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(createDefaultSiteConfig());
  const [buildings, setBuildings] = useState<SiteBuilding[]>(createDefaultInitialBuildings());
  const [elements, setElements] = useState<SiteElement[]>(createDefaultInitialElements());
  const [selectedItem, setSelectedItem] = useState<SelectedItemRef | null>({
    id: 'b-1',
    type: 'building',
  });
  const [placementTool, setPlacementTool] = useState<PlacementTool>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('master_map');
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);
  const [doubleClickTarget, setDoubleClickTarget] = useState<[number, number, number] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInitialMount = useRef(true);

  // Sync URL search parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const projectIdFromUrl = params.get('project');
      if (projectIdFromUrl) {
        const proj = projectManager.getProject(projectIdFromUrl);
        if (proj) {
          setActiveProject(proj);
          setBuildings(proj.buildings || createDefaultInitialBuildings());
          setElements(proj.elements || createDefaultInitialElements());
          setSiteConfig(proj.siteConfig || createDefaultSiteConfig());
          setSelectedItem(proj.buildings?.[0] ? { id: proj.buildings[0].id, type: 'building' } : null);
          setViewMode('planner');
        }
      }
    }
  }, []);

  // Load project by ID
  const handleOpenProject = (id: string) => {
    let proj = projectManager.getProject(id);
    if (!proj) {
      proj = projectManager.createProject();
    }
    setActiveProject(proj);
    setBuildings(proj.buildings || createDefaultInitialBuildings());
    setElements(proj.elements || createDefaultInitialElements());
    setSiteConfig(proj.siteConfig || createDefaultSiteConfig());
    setSelectedItem(proj.buildings?.[0] ? { id: proj.buildings[0].id, type: 'building' } : null);
    setViewMode('planner');

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `?project=${proj.id}`);
    }
  };

  // Create new project
  const handleCreateNewProject = () => {
    const newProj = projectManager.createProject();
    setActiveProject(newProj);
    setBuildings(newProj.buildings);
    setElements(newProj.elements);
    setSiteConfig(newProj.siteConfig);
    setSelectedItem({ id: newProj.buildings[0].id, type: 'building' });
    setViewMode('planner');

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `?project=${newProj.id}`);
    }
  };

  // Return to Dashboard Landing Page
  const handleBackToLanding = () => {
    setViewMode('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Auto-save changes to localStorage when working in planner mode
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (viewMode === 'planner' && activeProject) {
      projectManager.saveProject({
        ...activeProject,
        buildings,
        elements,
        siteConfig,
      });
    }
  }, [buildings, elements, siteConfig, viewMode, activeProject]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlacementTool(null);
        if (cameraPreset === 'street') {
          setCameraPreset('master_map');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraPreset]);

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

  const handleDoubleClickPoint = (point: [number, number, number]) => {
    setDoubleClickTarget(point);
    setTimeout(() => setDoubleClickTarget(null), 100);
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
    setSiteConfig(createDefaultSiteConfig());
    setBuildings(createDefaultInitialBuildings());
    setElements(createDefaultInitialElements());
    setSelectedItem({ id: 'b-1', type: 'building' });
    setPlacementTool(null);
    setFocusTarget(null);
    setCameraPreset('master_map');
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

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onOpenProject={handleOpenProject}
        onCreateNewProject={handleCreateNewProject}
      />
    );
  }

  const isStreetView = cameraPreset === 'street';

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Header Overlay */}
      {!isStreetView && (
        <Header
          siteConfig={siteConfig}
          onChangeSiteConfig={(newPartial) => setSiteConfig((prev) => ({ ...prev, ...newPartial }))}
          onCaptureScreenshot={handleCaptureScreenshot}
          onBackToLanding={handleBackToLanding}
          projectName={activeProject?.name}
        />

      )}


      {/* Top Creation Toolbar */}
      {!isStreetView && (
        <SitePlannerToolbar
          placementTool={placementTool}
          onSelectPlacementTool={setPlacementTool}
        />
      )}

      {/* Selected Item Control Panel */}
      {!isStreetView && (
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
      )}

      {/* Right Outliner Inventory */}
      {!isStreetView && (
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
      )}

      {/* Main Interactive 3D Canvas Scene */}
      <BuildingScene
        buildings={buildings}
        elements={elements}
        siteConfig={siteConfig}
        preset={cameraPreset}
        selectedItem={selectedItem}
        placementTool={placementTool}
        focusTarget={focusTarget}
        doubleClickTarget={doubleClickTarget}
        onDoubleClickPoint={handleDoubleClickPoint}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setFocusTarget(null);
          if (item) setPlacementTool(null);
        }}
        onUpdateTransform={handleUpdateTransform}
        onPlaceObjectAt={handlePlaceObjectAt}
        canvasRef={canvasRef}
        onExitStreetView={() => setCameraPreset('master_map')}
      />

      {/* Bottom Camera View Presets Bar */}
      {!isStreetView && (
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
      )}
    </div>
  );
};

export default App;
