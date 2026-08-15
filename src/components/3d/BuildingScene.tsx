import React, { useState, useEffect } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { Sky, ContactShadows, PivotControls } from '@react-three/drei';
import * as THREE from 'three';

import {
  SiteBuilding,
  SiteElement,
  SiteConfig,
  CameraPreset,
  SelectedItemRef,
  PlacementTool,
} from '../../types/building';

import { ProceduralBuilding } from './ProceduralBuilding';
import { SiteElementModel } from './SiteElementModels';
import { PlotGround } from './PlotGround';
import { CameraController } from './CameraController';

interface BuildingSceneProps {
  buildings: SiteBuilding[];
  elements: SiteElement[];
  siteConfig: SiteConfig;
  preset: CameraPreset;
  selectedItem: SelectedItemRef | null;
  placementTool: PlacementTool;
  focusTarget?: [number, number, number] | null;
  doubleClickTarget?: [number, number, number] | null;
  onSelectItem: (item: SelectedItemRef | null) => void;
  onDoubleClickPoint?: (point: [number, number, number]) => void;
  onUpdateTransform: (id: string, type: 'building' | 'element', newPos: [number, number, number], newRotY: number) => void;
  onPlaceObjectAt: (pos: [number, number, number]) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onExitStreetView?: () => void;
}

export const BuildingScene: React.FC<BuildingSceneProps> = ({
  buildings,
  elements,
  siteConfig,
  preset,
  selectedItem,
  placementTool,
  focusTarget,
  doubleClickTarget,
  onSelectItem,
  onDoubleClickPoint,
  onUpdateTransform,
  onPlaceObjectAt,
  canvasRef,
  onExitStreetView,
}) => {
  const { timeOfDay, gridSnap, snapSize } = siteConfig;

  const [cursorPos, setCursorPos] = useState<[number, number, number]>([0, 0, 0]);
  const [isPointerOverGround, setIsPointerOverGround] = useState(false);

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const sunPosition: [number, number, number] = isNight
    ? [30, 80, 30] // Moon position overhead
    : isSunset
    ? [100, 12, -50] // Low sun position
    : [60, 80, 50];

  const sunColor = isNight ? '#bae6fd' : isSunset ? '#f97316' : '#ffffff';
  const dirLightIntensity = isNight ? 0.15 : isSunset ? 1.8 : 2.2;
  const ambientIntensity = isNight ? 0.38 : isSunset ? 0.48 : 0.7;
  const ambientColor = isNight ? '#1e293b' : isSunset ? '#fed7aa' : '#ffffff';
  const fogColor = isNight ? '#030712' : isSunset ? '#1a0d00' : '#cbd5e1';

  const snap = (val: number): number => {
    if (!gridSnap || snapSize <= 0) return val;
    return Math.round(val / snapSize) * snapSize;
  };

  const handleGroundPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const point = e.point;
    const snappedX = snap(point.x);
    const snappedZ = snap(point.z);
    setCursorPos([snappedX, 0, snappedZ]);
    setIsPointerOverGround(true);
  };

  const handleGroundPointerClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (placementTool) {
      const point = e.point;
      const snappedX = snap(point.x);
      const snappedZ = snap(point.z);
      onPlaceObjectAt([snappedX, 0, snappedZ]);
    } else {
      onSelectItem(null);
    }
  };

  const handleGroundDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!placementTool && onDoubleClickPoint) {
      onDoubleClickPoint([e.point.x, e.point.y, e.point.z]);
    }
  };

  const isStreetView = preset === 'street';

  return (
    <div className="relative h-full w-full bg-slate-950">
      {/* Street View UI Overlay */}
      {isStreetView && (
        <>
          {/* Top-Right Exit Button */}
          {onExitStreetView && (
            <button
              onClick={onExitStreetView}
              className="absolute top-6 right-6 z-40 pointer-events-auto flex items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md border border-slate-700/60 transition-all hover:border-emerald-500/40"
              title="Exit Street View and return to Master Map"
            >
              <span>Exit (ESC)</span>
            </button>
          )}

          {/* Simple Floating Hint Card */}
          <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2 pointer-events-none flex flex-col items-center w-[90%] max-w-xs">
            <div className="w-full glass-panel border border-emerald-500/20 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs mb-1 uppercase tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Street View
              </div>
              <p className="text-slate-300 text-[11px] leading-normal mb-1">
                Click to lock mouse & look around (360°). Use <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono font-bold text-[9px]">W</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono font-bold text-[9px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono font-bold text-[9px]">S</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono font-bold text-[9px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono font-bold text-[9px]">Arrow Keys</kbd> to walk.
              </p>
            </div>
          </div>
        </>
      )}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 260, 220], fov: 48, far: 2500 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 150, 1600]} />

        {/* Lighting */}
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <hemisphereLight
          intensity={isNight ? 0.25 : isSunset ? 0.35 : 0.65}
          color={isNight ? '#bae6fd' : isSunset ? '#fdba74' : '#bae6fd'}
          groundColor={isNight ? '#020617' : isSunset ? '#2a1200' : '#14532d'}
        />

        <directionalLight
          position={sunPosition}
          intensity={dirLightIntensity}
          color={sunColor}
          castShadow={!isNight}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={1200}
          shadow-camera-left={-300}
          shadow-camera-right={300}
          shadow-camera-top={300}
          shadow-camera-bottom={-300}
          shadow-bias={-0.0001}
        />


        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={isSunset ? 0.52 : isNight ? 0.0 : 0.6}
          azimuth={isSunset ? 0.25 : 0.1}
          turbidity={isSunset ? 8 : 2}
          rayleigh={isSunset ? 6 : 1}
        />

        {/* Plot Ground */}
        <PlotGround config={siteConfig} />

        {/* Raycasting Ground Plane */}
        <mesh
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handleGroundPointerMove}
          onPointerLeave={() => setIsPointerOverGround(false)}
          onClick={handleGroundPointerClick}
          onDoubleClick={handleGroundDoubleClick}
          visible={false}
        >
          <planeGeometry args={[siteConfig.plotSize[0], siteConfig.plotSize[1]]} />
          <meshBasicMaterial />
        </mesh>

        {/* Ghost Placement Preview (only visible when actively placing an item) */}

        {/* Ghost Placement Preview */}
        {placementTool && isPointerOverGround && (
          <group position={cursorPos}>
            {placementTool === 'building' ? (
              <ProceduralBuilding
                config={{
                  floors: 5,
                  width: 16,
                  depth: 10,
                  showWindows: true,
                  showBalconies: true,
                  showParking: true,
                  showStreetLights: true,
                  wallColor: '#10b981',
                  windowColor: '#38bdf8',
                  trimColor: '#1e293b',
                  roofColor: '#334155',
                  balconyColor: '#38bdf8',
                  timeOfDay: siteConfig.timeOfDay,
                  propertyName: 'New Building',
                  propertySubtitle: '',
                }}
              />
            ) : (
              <SiteElementModel
                element={{
                  id: 'preview',
                  type: placementTool,
                  name: 'Placement Preview',
                  position: [0, 0, 0],
                  rotationY: 0,
                }}
                timeOfDay={siteConfig.timeOfDay}
                isSelected={true}
              />
            )}
          </group>
        )}

        {/* Render Buildings */}
        {buildings.map((b) => {
          const isSelected = selectedItem?.id === b.id && selectedItem?.type === 'building';

          const buildingContent = (
            <group
              key={b.id}
              position={b.position}
              rotation={[0, b.rotationY, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (!placementTool) {
                  onSelectItem({ id: b.id, type: 'building' });
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (!placementTool && onDoubleClickPoint) {
                  onDoubleClickPoint([e.point.x, e.point.y, e.point.z]);
                }
              }}
            >
              <ProceduralBuilding config={{ ...b.config, timeOfDay: siteConfig.timeOfDay }} />

              {isSelected && (
                <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[Math.max(b.config.width, b.config.depth) * 0.6, Math.max(b.config.width, b.config.depth) * 0.65, 32]} />
                  <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
                </mesh>
              )}
            </group>
          );

          if (isSelected && !placementTool) {
            return (
              <PivotControls
                key={`pivot-${b.id}`}
                scale={6}
                activeAxes={[true, false, true]}
                anchor={[0, 0, 0]}
                onDrag={(matrix) => {
                  const position = new THREE.Vector3();
                  const rotation = new THREE.Quaternion();
                  const scaleVec = new THREE.Vector3();
                  matrix.decompose(position, rotation, scaleVec);

                  const euler = new THREE.Euler().setFromQuaternion(rotation);
                  const newX = snap(position.x);
                  const newZ = snap(position.z);

                  onUpdateTransform(b.id, 'building', [newX, 0, newZ], euler.y);
                }}
              >
                {buildingContent}
              </PivotControls>
            );
          }

          return buildingContent;
        })}

        {/* Render Site Elements */}
        {elements.map((el) => {
          const isSelected = selectedItem?.id === el.id && selectedItem?.type === 'element';

          const elementContent = (
            <group
              key={el.id}
              position={el.position}
              rotation={[0, el.rotationY, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (!placementTool) {
                  onSelectItem({ id: el.id, type: 'element' });
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (!placementTool && onDoubleClickPoint) {
                  onDoubleClickPoint([e.point.x, e.point.y, e.point.z]);
                }
              }}
            >
              <SiteElementModel
                element={el}
                timeOfDay={siteConfig.timeOfDay}
                isSelected={isSelected}
              />
            </group>
          );

          if (isSelected && !placementTool) {
            return (
              <PivotControls
                key={`pivot-el-${el.id}`}
                scale={5}
                activeAxes={[true, false, true]}
                anchor={[0, 0, 0]}
                onDrag={(matrix) => {
                  const position = new THREE.Vector3();
                  const rotation = new THREE.Quaternion();
                  const scaleVec = new THREE.Vector3();
                  matrix.decompose(position, rotation, scaleVec);

                  const euler = new THREE.Euler().setFromQuaternion(rotation);
                  const newX = snap(position.x);
                  const newZ = snap(position.z);

                  onUpdateTransform(el.id, 'element', [newX, 0, newZ], euler.y);
                }}
              >
                {elementContent}
              </PivotControls>
            );
          }

          return elementContent;
        })}

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.65}
          scale={160}
          blur={1.8}
          far={12}
          resolution={1024}
          color="#000000"
        />

        {/* Camera Controller */}
        <CameraController
          preset={preset}
          focusTarget={focusTarget}
          doubleClickTarget={doubleClickTarget}
          buildings={buildings}
          plotSize={siteConfig.plotSize}
          onExitStreetView={onExitStreetView}
        />
      </Canvas>
    </div>
  );
};
