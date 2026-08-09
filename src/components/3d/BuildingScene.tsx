import React, { useState } from 'react';
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
    ? [-100, -20, -100]
    : isSunset
    ? [100, 10, -50]
    : [60, 80, 50];

  const sunColor = isNight ? '#38bdf8' : isSunset ? '#fb923c' : '#ffffff';
  const dirLightIntensity = isNight ? 0.35 : isSunset ? 1.6 : 2.2;
  const ambientIntensity = isNight ? 0.25 : isSunset ? 0.5 : 0.7;
  const fogColor = isNight ? '#090d16' : isSunset ? '#451a03' : '#cbd5e1';

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

  const isStreetView = preset === 'street' || preset === 'street_walk';

  return (
    <div className="relative h-full w-full bg-slate-950">
      {/* Street View UI Overlay */}
      {isStreetView && (
        <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-3 w-[90%] max-w-sm pointer-events-none">
          {/* WASD + Mouse Hint */}
          <div className="w-full glass-panel border border-amber-500/25 bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs mb-1.5 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Street View Mode
            </div>
            <p className="text-slate-300 text-xs leading-relaxed mb-3">
              Click on screen to lock cursor and look around. Use <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono font-bold text-[10px]">W</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono font-bold text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono font-bold text-[10px]">S</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono font-bold text-[10px]">D</kbd> keys to walk.
            </p>
            <div className="text-[10px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-semibold">ESC</kbd> to unlock mouse cursor.
            </div>
          </div>

          {/* Exit Street View Button */}
          {onExitStreetView && (
            <button
              onClick={onExitStreetView}
              className="pointer-events-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl px-5 py-2.5 shadow-xl shadow-rose-950/20 transition-all border border-rose-500/20"
            >
              Exit Street View
            </button>
          )}
        </div>
      )}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 140, 0.1], fov: 48 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 60, 260]} />

        {/* Lighting */}
        <ambientLight intensity={ambientIntensity} color={sunColor} />
        <hemisphereLight
          intensity={isNight ? 0.2 : isSunset ? 0.4 : 0.6}
          color={isNight ? '#1e293b' : isSunset ? '#fdba74' : '#bae6fd'}
          groundColor={isNight ? '#020617' : isSunset ? '#451a03' : '#14532d'}
        />

        <directionalLight
          position={sunPosition}
          intensity={dirLightIntensity}
          color={sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={250}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
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
        />
      </Canvas>
    </div>
  );
};
