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
  onSelectItem: (item: SelectedItemRef | null) => void;
  onUpdateTransform: (id: string, type: 'building' | 'element', newPos: [number, number, number], newRotY: number) => void;
  onPlaceObjectAt: (pos: [number, number, number]) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const BuildingScene: React.FC<BuildingSceneProps> = ({
  buildings,
  elements,
  siteConfig,
  preset,
  selectedItem,
  placementTool,
  focusTarget,
  onSelectItem,
  onUpdateTransform,
  onPlaceObjectAt,
  canvasRef,
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

  return (
    <div className="relative h-full w-full bg-slate-950">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 140, 0.1], fov: 45 }}
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
          visible={false}
        >
          <planeGeometry args={[siteConfig.plotSize[0], siteConfig.plotSize[1]]} />
          <meshBasicMaterial />
        </mesh>

        {/* Ghost Placement Preview */}
        {placementTool && isPointerOverGround && (
          <group position={cursorPos}>
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[4, 5, 32]} />
              <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>

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

        {/* Selection Ground Marker */}
        {!placementTool && selectedItem && isPointerOverGround && (
          <mesh position={[cursorPos[0], 0.05, cursorPos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.2, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
          </mesh>
        )}

        {/* Buildings */}
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

        {/* Site Elements */}
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

        {/* Camera Controller with focusTarget & WASD Street Walking support */}
        <CameraController preset={preset} focusTarget={focusTarget} />
      </Canvas>
    </div>
  );
};
