import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingConfig } from '../../types/building';

interface BuildingProps {
  config: BuildingConfig;
}

export const ProceduralBuilding: React.FC<BuildingProps> = ({ config }) => {
  const {
    floors,
    showWindows,
    showBalconies,
    wallColor,
    windowColor,
    trimColor,
    roofColor,
    balconyColor,
    timeOfDay,
  } = config;

  // Building geometry dimensions
  const buildingWidth = 14;
  const buildingDepth = 10;
  const groundFloorHeight = 4.2;
  const standardFloorHeight = 3.2;
  const totalBuildingHeight = groundFloorHeight + (floors - 1) * standardFloorHeight;

  // Materials setup
  const materials = useMemo(() => {
    const isNight = timeOfDay === 'night';
    const isSunset = timeOfDay === 'sunset';

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.5,
      metalness: 0.1,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      roughness: 0.3,
      metalness: 0.2,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: roofColor,
      roughness: 0.8,
      metalness: 0.1,
    });

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: windowColor,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.5,
      transparent: true,
      opacity: 0.8,
      reflectivity: 0.9,
      emissive: isNight ? new THREE.Color('#fef08a') : isSunset ? new THREE.Color('#fed7aa') : new THREE.Color('#000000'),
      emissiveIntensity: isNight ? 0.6 : isSunset ? 0.25 : 0.0,
    });

    const balconyGlassMat = new THREE.MeshPhysicalMaterial({
      color: balconyColor,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.7,
      transparent: true,
      opacity: 0.6,
    });

    const railingMetalMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.2,
      metalness: 0.8,
    });

    const entranceGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.85,
      transparent: true,
      opacity: 0.7,
      emissive: isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff'),
      emissiveIntensity: isNight ? 0.8 : isSunset ? 0.4 : 0.1,
    });

    const doorFrameMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.3,
      metalness: 0.7,
    });

    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: '#1e1b4b',
      roughness: 0.1,
      metalness: 0.9,
    });

    return {
      wallMat,
      trimMat,
      roofMat,
      windowGlassMat,
      balconyGlassMat,
      railingMetalMat,
      entranceGlassMat,
      doorFrameMat,
      solarPanelMat,
    };
  }, [wallColor, windowColor, trimColor, roofColor, balconyColor, timeOfDay]);

  // Intermediate floor positions calculation
  const floorHeights = useMemo(() => {
    const list: { y: number; index: number }[] = [];
    for (let i = 0; i < floors; i++) {
      if (i === 0) {
        list.push({ y: groundFloorHeight / 2, index: 0 });
      } else {
        const y = groundFloorHeight + (i - 1) * standardFloorHeight + standardFloorHeight / 2;
        list.push({ y, index: i });
      }
    }
    return list;
  }, [floors, groundFloorHeight, standardFloorHeight]);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Floor Base & Entrance Lobby */}
      <group position={[0, groundFloorHeight / 2, 0]}>
        {/* Main Wall Structure for Ground Floor */}
        <mesh castShadow receiveShadow material={materials.wallMat}>
          <boxGeometry args={[buildingWidth, groundFloorHeight, buildingDepth]} />
        </mesh>

        {/* Entrance Recess / Glass Facade */}
        <mesh position={[0, -0.2, buildingDepth / 2 + 0.05]} material={materials.entranceGlassMat}>
          <boxGeometry args={[6, 3.2, 0.1]} />
        </mesh>

        {/* Entrance Frame & Canopy */}
        <group position={[0, 0, buildingDepth / 2 + 0.3]}>
          {/* Top Canopy Overhang */}
          <mesh castShadow position={[0, 1.6, 0.6]} material={materials.trimMat}>
            <boxGeometry args={[7.2, 0.3, 1.8]} />
          </mesh>

          {/* Pillars / Columns */}
          <mesh castShadow position={[-3.3, -0.2, 1.2]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
          </mesh>
          <mesh castShadow position={[3.3, -0.2, 1.2]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
          </mesh>

          {/* Entrance Door Handles & Frame divider */}
          <mesh position={[0, -0.3, 0.1]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.08, 2.8, 0.12]} />
          </mesh>
          {/* Glass Door Handles */}
          <mesh position={[-0.2, -0.3, 0.15]} material={materials.railingMetalMat}>
            <boxGeometry args={[0.04, 0.6, 0.04]} />
          </mesh>
          <mesh position={[0.2, -0.3, 0.15]} material={materials.railingMetalMat}>
            <boxGeometry args={[0.04, 0.6, 0.04]} />
          </mesh>

          {/* "GREEN RESIDENCY" Entrance Sign */}
          <mesh position={[0, 1.6, 1.52]} material={materials.railingMetalMat}>
            <boxGeometry args={[4.2, 0.4, 0.05]} />
          </mesh>
        </group>

        {/* Ground Floor Steps */}
        <mesh receiveShadow position={[0, -groundFloorHeight / 2 + 0.15, buildingDepth / 2 + 0.8]} material={materials.trimMat}>
          <boxGeometry args={[8, 0.3, 1.6]} />
        </mesh>
        <mesh receiveShadow position={[0, -groundFloorHeight / 2 + 0.35, buildingDepth / 2 + 0.4]} material={materials.trimMat}>
          <boxGeometry args={[7.2, 0.2, 1.0]} />
        </mesh>

        {/* Decorative Ground Floor Planters */}
        <group position={[-5, -groundFloorHeight / 2 + 0.4, buildingDepth / 2 + 0.6]}>
          <mesh castShadow receiveShadow material={materials.trimMat}>
            <boxGeometry args={[1.6, 0.8, 1.2]} />
          </mesh>
          {/* Plant Leaves */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>
        <group position={[5, -groundFloorHeight / 2 + 0.4, buildingDepth / 2 + 0.6]}>
          <mesh castShadow receiveShadow material={materials.trimMat}>
            <boxGeometry args={[1.6, 0.8, 1.2]} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>

        {/* Ground Floor Side Windows */}
        {showWindows && (
          <>
            <mesh position={[-5, 0.2, buildingDepth / 2 + 0.05]} material={materials.windowGlassMat}>
              <boxGeometry args={[2.4, 2.2, 0.1]} />
            </mesh>
            <mesh position={[5, 0.2, buildingDepth / 2 + 0.05]} material={materials.windowGlassMat}>
              <boxGeometry args={[2.4, 2.2, 0.1]} />
            </mesh>
          </>
        )}
      </group>

      {/* Floors (Floors 1 to N) */}
      {floorHeights.map((floor) => {
        if (floor.index === 0) return null; // Ground floor handled separately above

        const isTopFloor = floor.index === floors - 1;

        return (
          <group key={floor.index} position={[0, floor.y, 0]}>
            {/* Main Floor Block */}
            <mesh castShadow receiveShadow material={materials.wallMat}>
              <boxGeometry args={[buildingWidth, standardFloorHeight, buildingDepth]} />
            </mesh>

            {/* Architectural Floor Slab / Trim Belt */}
            <mesh castShadow receiveShadow position={[0, -standardFloorHeight / 2 + 0.1, 0]} material={materials.trimMat}>
              <boxGeometry args={[buildingWidth + 0.4, 0.25, buildingDepth + 0.4]} />
            </mesh>

            {/* Windows Front & Back */}
            {showWindows && (
              <group>
                {/* Front Windows (4 Windows per floor) */}
                {[-4.8, -1.6, 1.6, 4.8].map((xPos, idx) => (
                  <group key={`front-win-${idx}`} position={[xPos, 0.1, buildingDepth / 2 + 0.05]}>
                    {/* Window Frame */}
                    <mesh material={materials.doorFrameMat}>
                      <boxGeometry args={[2.2, 2.0, 0.12]} />
                    </mesh>
                    {/* Glass Pane */}
                    <mesh material={materials.windowGlassMat}>
                      <boxGeometry args={[2.0, 1.8, 0.15]} />
                    </mesh>
                    {/* Mullion Frame Accent */}
                    <mesh material={materials.trimMat}>
                      <boxGeometry args={[0.05, 1.8, 0.18]} />
                    </mesh>
                  </group>
                ))}

                {/* Back Windows */}
                {[-4.8, -1.6, 1.6, 4.8].map((xPos, idx) => (
                  <group key={`back-win-${idx}`} position={[xPos, 0.1, -buildingDepth / 2 - 0.05]}>
                    <mesh material={materials.doorFrameMat}>
                      <boxGeometry args={[2.2, 2.0, 0.12]} />
                    </mesh>
                    <mesh material={materials.windowGlassMat}>
                      <boxGeometry args={[2.0, 1.8, 0.15]} />
                    </mesh>
                  </group>
                ))}

                {/* Side Windows (Left & Right) */}
                {[-2.5, 2.5].map((zPos, idx) => (
                  <group key={`side-win-left-${idx}`} position={[-buildingWidth / 2 - 0.05, 0.1, zPos]}>
                    <mesh material={materials.doorFrameMat}>
                      <boxGeometry args={[0.12, 1.8, 2.0]} />
                    </mesh>
                    <mesh material={materials.windowGlassMat}>
                      <boxGeometry args={[0.15, 1.6, 1.8]} />
                    </mesh>
                  </group>
                ))}
                {[-2.5, 2.5].map((zPos, idx) => (
                  <group key={`side-win-right-${idx}`} position={[buildingWidth / 2 + 0.05, 0.1, zPos]}>
                    <mesh material={materials.doorFrameMat}>
                      <boxGeometry args={[0.12, 1.8, 2.0]} />
                    </mesh>
                    <mesh material={materials.windowGlassMat}>
                      <boxGeometry args={[0.15, 1.6, 1.8]} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}

            {/* Balconies */}
            {showBalconies && (
              <group>
                {/* 2 Wide Front Balconies per Floor */}
                {[-3.2, 3.2].map((xPos, idx) => (
                  <group key={`balcony-${idx}`} position={[xPos, -0.6, buildingDepth / 2 + 0.9]}>
                    {/* Balcony Floor Slab */}
                    <mesh castShadow receiveShadow material={materials.trimMat}>
                      <boxGeometry args={[4.8, 0.25, 1.8]} />
                    </mesh>

                    {/* Balcony Railing - Front Glass Pane */}
                    <mesh position={[0, 0.6, 0.85]} material={materials.balconyGlassMat}>
                      <boxGeometry args={[4.7, 0.95, 0.05]} />
                    </mesh>

                    {/* Balcony Railing - Left & Right Glass */}
                    <mesh position={[-2.3, 0.6, 0]} material={materials.balconyGlassMat}>
                      <boxGeometry args={[0.05, 0.95, 1.65]} />
                    </mesh>
                    <mesh position={[2.3, 0.6, 0]} material={materials.balconyGlassMat}>
                      <boxGeometry args={[0.05, 0.95, 1.65]} />
                    </mesh>

                    {/* Railing Handrail Trim (Top Metal Rail) */}
                    <mesh position={[0, 1.1, 0.85]} material={materials.railingMetalMat}>
                      <boxGeometry args={[4.8, 0.08, 0.08]} />
                    </mesh>
                    <mesh position={[-2.3, 1.1, 0]} material={materials.railingMetalMat}>
                      <boxGeometry args={[0.08, 0.08, 1.7]} />
                    </mesh>
                    <mesh position={[2.3, 1.1, 0]} material={materials.railingMetalMat}>
                      <boxGeometry args={[0.08, 0.08, 1.7]} />
                    </mesh>

                    {/* Sliding Door Behind Balcony */}
                    <mesh position={[0, 0.95, -0.85]} material={materials.windowGlassMat}>
                      <boxGeometry args={[2.8, 2.2, 0.1]} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* Rooftop Parapet Wall & Mechanical Penthouse */}
      <group position={[0, totalBuildingHeight + 0.1, 0]}>
        {/* Main Roof Slab */}
        <mesh castShadow receiveShadow material={materials.roofMat}>
          <boxGeometry args={[buildingWidth + 0.6, 0.3, buildingDepth + 0.6]} />
        </mesh>

        {/* Roof Parapet Walls (Perimeter) */}
        <mesh castShadow position={[0, 0.6, buildingDepth / 2 + 0.2]} material={materials.trimMat}>
          <boxGeometry args={[buildingWidth + 0.6, 0.9, 0.2]} />
        </mesh>
        <mesh castShadow position={[0, 0.6, -buildingDepth / 2 - 0.2]} material={materials.trimMat}>
          <boxGeometry args={[buildingWidth + 0.6, 0.9, 0.2]} />
        </mesh>
        <mesh castShadow position={[buildingWidth / 2 + 0.2, 0.6, 0]} material={materials.trimMat}>
          <boxGeometry args={[0.2, 0.9, buildingDepth + 0.2]} />
        </mesh>
        <mesh castShadow position={[-buildingWidth / 2 - 0.2, 0.6, 0]} material={materials.trimMat}>
          <boxGeometry args={[0.2, 0.9, buildingDepth + 0.2]} />
        </mesh>

        {/* Roof Elevator Penthouse structure */}
        <group position={[-2.5, 1.5, 0]}>
          <mesh castShadow receiveShadow material={materials.wallMat}>
            <boxGeometry args={[4.5, 2.4, 4.0]} />
          </mesh>
          <mesh castShadow position={[0, 1.25, 0]} material={materials.doorFrameMat}>
            <boxGeometry args={[4.7, 0.2, 4.2]} />
          </mesh>
          {/* Access Door */}
          <mesh position={[0, -0.2, 2.05]} material={materials.doorFrameMat}>
            <boxGeometry args={[1.2, 2.0, 0.1]} />
          </mesh>
        </group>

        {/* Rooftop Solar Panels Array */}
        <group position={[3.2, 0.4, 0]}>
          {[-1.8, 0, 1.8].map((zPos, idx) => (
            <mesh key={`solar-${idx}`} castShadow position={[0, 0.2, zPos]} rotation={[0.3, 0, 0]} material={materials.solarPanelMat}>
              <boxGeometry args={[4.0, 0.1, 1.4]} />
            </mesh>
          ))}
        </group>

        {/* HVAC AC Units */}
        <group position={[-4.5, 0.5, -2.5]}>
          <mesh castShadow material={materials.railingMetalMat}>
            <boxGeometry args={[1.2, 1.0, 1.2]} />
          </mesh>
        </group>
        <group position={[-4.5, 0.5, 2.5]}>
          <mesh castShadow material={materials.railingMetalMat}>
            <boxGeometry args={[1.2, 1.0, 1.2]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
