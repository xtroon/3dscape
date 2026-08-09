import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingConfig } from '../../types/building';

interface BuildingProps {
  config: BuildingConfig;
}

export const ProceduralBuilding: React.FC<BuildingProps> = ({ config }) => {
  const {
    floors,
    width = 16,
    depth = 10,
    showWindows,
    showBalconies,
    wallColor,
    windowColor,
    trimColor,
    roofColor,
    balconyColor,
    timeOfDay,
  } = config;

  // Dynamic Building Geometry Dimensions
  const buildingWidth = Math.max(10, Math.min(40, width));
  const buildingDepth = Math.max(8, Math.min(30, depth));
  const groundFloorHeight = 4.2;
  const standardFloorHeight = 3.2;
  const totalBuildingHeight = groundFloorHeight + (floors - 1) * standardFloorHeight;

  // Dynamic window positions calculation based on customizable building dimensions
  const frontWindowPositions = useMemo(() => {
    const count = Math.max(2, Math.floor((buildingWidth - 2.4) / 3.2));
    const spacing = (buildingWidth - 2.4) / (count + 1);
    const positions: number[] = [];
    for (let i = 1; i <= count; i++) {
      positions.push(-buildingWidth / 2 + 1.2 + i * spacing);
    }
    return positions;
  }, [buildingWidth]);

  const sideWindowPositions = useMemo(() => {
    const count = Math.max(1, Math.floor((buildingDepth - 2.4) / 3.2));
    const spacing = (buildingDepth - 2.4) / (count + 1);
    const positions: number[] = [];
    for (let i = 1; i <= count; i++) {
      positions.push(-buildingDepth / 2 + 1.2 + i * spacing);
    }
    return positions;
  }, [buildingDepth]);

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

  // Intermediate floor heights calculation
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

  const entranceWidth = Math.min(7.2, buildingWidth * 0.5);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Floor Base & Main Lobby */}
      <group position={[0, groundFloorHeight / 2, 0]}>
        {/* Main Base Structure */}
        <mesh castShadow receiveShadow material={materials.wallMat}>
          <boxGeometry args={[buildingWidth, groundFloorHeight, buildingDepth]} />
        </mesh>

        {/* Entrance Glass Facade */}
        <mesh position={[0, -0.2, buildingDepth / 2 + 0.05]} material={materials.entranceGlassMat}>
          <boxGeometry args={[entranceWidth, 3.2, 0.1]} />
        </mesh>

        {/* Entrance Frame & Canopy */}
        <group position={[0, 0, buildingDepth / 2 + 0.3]}>
          {/* Top Canopy Overhang */}
          <mesh castShadow position={[0, 1.6, 0.6]} material={materials.trimMat}>
            <boxGeometry args={[entranceWidth + 1.2, 0.3, 1.8]} />
          </mesh>

          {/* Active Canopy SpotLight */}
          {(timeOfDay === 'night' || timeOfDay === 'sunset') && (
            <spotLight
              position={[0, 1.35, 0.6]}
              intensity={timeOfDay === 'night' ? 22 : 10}
              color="#fef08a" // Warm glow
              distance={10}
              angle={Math.PI / 3}
              penumbra={0.7}
              decay={1.8}
              castShadow
              shadow-bias={-0.0002}
            />
          )}

          {/* Pillars */}
          <mesh castShadow position={[-entranceWidth / 2 - 0.2, -0.2, 1.2]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
          </mesh>
          <mesh castShadow position={[entranceWidth / 2 + 0.2, -0.2, 1.2]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
          </mesh>

          {/* Divider Frame */}
          <mesh position={[0, -0.3, 0.1]} material={materials.doorFrameMat}>
            <boxGeometry args={[0.08, 2.8, 0.12]} />
          </mesh>
        </group>

        {/* Ground Steps */}
        <mesh receiveShadow position={[0, -groundFloorHeight / 2 + 0.15, buildingDepth / 2 + 0.8]} material={materials.trimMat}>
          <boxGeometry args={[entranceWidth + 2, 0.3, 1.6]} />
        </mesh>
      </group>

      {/* Floors 1 to N */}
      {floorHeights.map((floor) => {
        if (floor.index === 0) return null;

        return (
          <group key={floor.index} position={[0, floor.y, 0]}>
            {/* Main Floor Wall Block */}
            <mesh castShadow receiveShadow material={materials.wallMat}>
              <boxGeometry args={[buildingWidth, standardFloorHeight, buildingDepth]} />
            </mesh>

            {/* Architectural Floor Belt */}
            <mesh castShadow receiveShadow position={[0, -standardFloorHeight / 2 + 0.1, 0]} material={materials.trimMat}>
              <boxGeometry args={[buildingWidth + 0.4, 0.25, buildingDepth + 0.4]} />
            </mesh>

            {/* Dynamic Windows */}
            {showWindows && (
              <group>
                {/* Front Windows */}
                {frontWindowPositions.map((xPos, idx) => {
                  const hash = Math.sin(floor.index * 12.9898 + idx * 78.233 + 1.5) * 43758.5453;
                  const rand = hash - Math.floor(hash);
                  const isLit = rand > 0.35;
                  const isDim = !isLit && rand > 0.15;
                  const emissiveVal = isLit
                    ? (timeOfDay === 'night' ? 1.0 : 0.4)
                    : isDim
                    ? (timeOfDay === 'night' ? 0.25 : 0.1)
                    : 0.0;

                  return (
                    <group key={`front-win-${idx}`} position={[xPos, 0.1, buildingDepth / 2 + 0.05]}>
                      <mesh material={materials.doorFrameMat}>
                        <boxGeometry args={[2.0, 2.0, 0.12]} />
                      </mesh>
                      <mesh>
                        <boxGeometry args={[1.8, 1.8, 0.15]} />
                        <meshPhysicalMaterial
                          color={windowColor}
                          roughness={0.1}
                          metalness={0.8}
                          transmission={0.5}
                          transparent
                          opacity={0.8}
                          reflectivity={0.9}
                          emissive={emissiveVal > 0 ? (timeOfDay === 'night' ? new THREE.Color('#fef08a') : new THREE.Color('#fed7aa')) : new THREE.Color('#000000')}
                          emissiveIntensity={emissiveVal}
                        />
                      </mesh>
                    </group>
                  );
                })}

                {/* Back Windows */}
                {frontWindowPositions.map((xPos, idx) => {
                  const hash = Math.sin(floor.index * 12.9898 + idx * 78.233 + 2.5) * 43758.5453;
                  const rand = hash - Math.floor(hash);
                  const isLit = rand > 0.35;
                  const isDim = !isLit && rand > 0.15;
                  const emissiveVal = isLit
                    ? (timeOfDay === 'night' ? 1.0 : 0.4)
                    : isDim
                    ? (timeOfDay === 'night' ? 0.25 : 0.1)
                    : 0.0;

                  return (
                    <group key={`back-win-${idx}`} position={[xPos, 0.1, -buildingDepth / 2 - 0.05]}>
                      <mesh material={materials.doorFrameMat}>
                        <boxGeometry args={[2.0, 2.0, 0.12]} />
                      </mesh>
                      <mesh>
                        <boxGeometry args={[1.8, 1.8, 0.15]} />
                        <meshPhysicalMaterial
                          color={windowColor}
                          roughness={0.1}
                          metalness={0.8}
                          transmission={0.5}
                          transparent
                          opacity={0.8}
                          reflectivity={0.9}
                          emissive={emissiveVal > 0 ? (timeOfDay === 'night' ? new THREE.Color('#fef08a') : new THREE.Color('#fed7aa')) : new THREE.Color('#000000')}
                          emissiveIntensity={emissiveVal}
                        />
                      </mesh>
                    </group>
                  );
                })}

                {/* Side Windows (Left) */}
                {sideWindowPositions.map((zPos, idx) => {
                  const hash = Math.sin(floor.index * 12.9898 + idx * 78.233 + 3.5) * 43758.5453;
                  const rand = hash - Math.floor(hash);
                  const isLit = rand > 0.35;
                  const isDim = !isLit && rand > 0.15;
                  const emissiveVal = isLit
                    ? (timeOfDay === 'night' ? 1.0 : 0.4)
                    : isDim
                    ? (timeOfDay === 'night' ? 0.25 : 0.1)
                    : 0.0;

                  return (
                    <group key={`side-win-left-${idx}`} position={[-buildingWidth / 2 - 0.05, 0.1, zPos]}>
                      <mesh material={materials.doorFrameMat}>
                        <boxGeometry args={[0.12, 1.8, 1.8]} />
                      </mesh>
                      <mesh>
                        <boxGeometry args={[0.15, 1.6, 1.6]} />
                        <meshPhysicalMaterial
                          color={windowColor}
                          roughness={0.1}
                          metalness={0.8}
                          transmission={0.5}
                          transparent
                          opacity={0.8}
                          reflectivity={0.9}
                          emissive={emissiveVal > 0 ? (timeOfDay === 'night' ? new THREE.Color('#fef08a') : new THREE.Color('#fed7aa')) : new THREE.Color('#000000')}
                          emissiveIntensity={emissiveVal}
                        />
                      </mesh>
                    </group>
                  );
                })}

                {/* Side Windows (Right) */}
                {sideWindowPositions.map((zPos, idx) => {
                  const hash = Math.sin(floor.index * 12.9898 + idx * 78.233 + 4.5) * 43758.5453;
                  const rand = hash - Math.floor(hash);
                  const isLit = rand > 0.35;
                  const isDim = !isLit && rand > 0.15;
                  const emissiveVal = isLit
                    ? (timeOfDay === 'night' ? 1.0 : 0.4)
                    : isDim
                    ? (timeOfDay === 'night' ? 0.25 : 0.1)
                    : 0.0;

                  return (
                    <group key={`side-win-right-${idx}`} position={[buildingWidth / 2 + 0.05, 0.1, zPos]}>
                      <mesh material={materials.doorFrameMat}>
                        <boxGeometry args={[0.12, 1.8, 1.8]} />
                      </mesh>
                      <mesh>
                        <boxGeometry args={[0.15, 1.6, 1.6]} />
                        <meshPhysicalMaterial
                          color={windowColor}
                          roughness={0.1}
                          metalness={0.8}
                          transmission={0.5}
                          transparent
                          opacity={0.8}
                          reflectivity={0.9}
                          emissive={emissiveVal > 0 ? (timeOfDay === 'night' ? new THREE.Color('#fef08a') : new THREE.Color('#fed7aa')) : new THREE.Color('#000000')}
                          emissiveIntensity={emissiveVal}
                        />
                      </mesh>
                    </group>
                  );
                })}
              </group>
            )}

            {/* Balconies */}
            {showBalconies && (
              <group>
                {frontWindowPositions.map((xPos, idx) => (
                  <group key={`balcony-${idx}`} position={[xPos, -0.6, buildingDepth / 2 + 0.8]}>
                    <mesh castShadow receiveShadow material={materials.trimMat}>
                      <boxGeometry args={[2.4, 0.25, 1.6]} />
                    </mesh>
                    <mesh position={[0, 0.6, 0.75]} material={materials.balconyGlassMat}>
                      <boxGeometry args={[2.3, 0.95, 0.05]} />
                    </mesh>
                    <mesh position={[0, 1.1, 0.75]} material={materials.railingMetalMat}>
                      <boxGeometry args={[2.4, 0.08, 0.08]} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* Rooftop Structure */}
      <group position={[0, totalBuildingHeight + 0.1, 0]}>
        {/* Main Roof Slab */}
        <mesh castShadow receiveShadow material={materials.roofMat}>
          <boxGeometry args={[buildingWidth + 0.6, 0.3, buildingDepth + 0.6]} />
        </mesh>

        {/* Roof Parapet Walls */}
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

        {/* Elevator Mechanical Penthouse */}
        <group position={[-buildingWidth / 4, 1.5, 0]}>
          <mesh castShadow receiveShadow material={materials.wallMat}>
            <boxGeometry args={[4.5, 2.4, 4.0]} />
          </mesh>
          <mesh castShadow position={[0, 1.25, 0]} material={materials.doorFrameMat}>
            <boxGeometry args={[4.7, 0.2, 4.2]} />
          </mesh>
        </group>

        {/* Rooftop Solar Panels */}
        <group position={[buildingWidth / 4, 0.4, 0]}>
          {[-1.5, 1.5].map((zPos, idx) => (
            <mesh key={`solar-${idx}`} castShadow position={[0, 0.2, zPos]} rotation={[0.3, 0, 0]} material={materials.solarPanelMat}>
              <boxGeometry args={[Math.min(6, buildingWidth * 0.4), 0.1, 1.4]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
