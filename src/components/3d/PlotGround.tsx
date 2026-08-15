import React from 'react';
import * as THREE from 'three';
import { SiteConfig } from '../../types/building';

interface PlotGroundProps {
  config: SiteConfig;
}

export const PlotGround: React.FC<PlotGroundProps> = ({ config }) => {
  const { showBoundaryWall, showGridLines, plotSize, timeOfDay } = config;
  const [width, depth] = plotSize;

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const grassMat = new THREE.MeshStandardMaterial({
    color: isNight ? '#064e3b' : isSunset ? '#15803d' : '#16a34a',
    roughness: 0.9,
    metalness: 0.05,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: isNight ? '#1e293b' : '#cbd5e1',
    roughness: 0.6,
    metalness: 0.1,
  });

  const pillarMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.3,
    metalness: 0.7,
  });

  const mainRoadMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.8,
  });

  const stripeYellowMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.4,
  });

  const yellowDashPositions = Array.from(
    { length: Math.floor((width + 200) / 20) },
    (_, i) => -(width + 200) / 2 + 10 + i * 20
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Infinite Horizon Grass Ground */}
      <mesh receiveShadow position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3000, 3000]} />
        <primitive object={grassMat} attach="material" />
      </mesh>

      {/* Main Ground Grass Lawn Plane */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={grassMat} attach="material" />
      </mesh>

      {/* Grid Lines Overlay */}
      {showGridLines && (
        <gridHelper
          args={[width, Math.max(20, Math.round(width / 5)), '#0284c7', '#334155']}
          position={[0, 0.02, 0]}
        />
      )}

      {/* Perimeter Boundary Wall */}
      {showBoundaryWall && (
        <group>
          {/* Back Wall */}
          <mesh castShadow receiveShadow position={[0, 1.2, -depth / 2]} material={wallMat}>
            <boxGeometry args={[width, 2.4, 0.6]} />
          </mesh>

          {/* Left Wall */}
          <mesh castShadow receiveShadow position={[-width / 2, 1.2, 0]} material={wallMat}>
            <boxGeometry args={[0.6, 2.4, depth]} />
          </mesh>

          {/* Right Wall */}
          <mesh castShadow receiveShadow position={[width / 2, 1.2, 0]} material={wallMat}>
            <boxGeometry args={[0.6, 2.4, depth]} />
          </mesh>

          {/* Front Wall (with 24m Entrance Gate Gap in Center) */}
          <mesh castShadow receiveShadow position={[-width / 4 - 6, 1.2, depth / 2]} material={wallMat}>
            <boxGeometry args={[width / 2 - 12, 2.4, 0.6]} />
          </mesh>
          <mesh castShadow receiveShadow position={[width / 4 + 6, 1.2, depth / 2]} material={wallMat}>
            <boxGeometry args={[width / 2 - 12, 2.4, 0.6]} />
          </mesh>

          {/* Grand Entrance Pillars */}
          <group position={[-12, 0, depth / 2]}>
            <mesh castShadow receiveShadow position={[0, 2.0, 0]} material={pillarMat}>
              <boxGeometry args={[1.6, 4.0, 1.6]} />
            </mesh>
            <mesh position={[0, 4.15, 0]} material={pillarMat}>
              <boxGeometry args={[2.0, 0.3, 2.0]} />
            </mesh>
            {isNight && (
              <pointLight position={[0, 4.3, 0]} color="#fbbf24" intensity={8} distance={15} />
            )}
          </group>

          <group position={[12, 0, depth / 2]}>
            <mesh castShadow receiveShadow position={[0, 2.0, 0]} material={pillarMat}>
              <boxGeometry args={[1.6, 4.0, 1.6]} />
            </mesh>
            <mesh position={[0, 4.15, 0]} material={pillarMat}>
              <boxGeometry args={[2.0, 0.3, 2.0]} />
            </mesh>
            {isNight && (
              <pointLight position={[0, 4.3, 0]} color="#fbbf24" intensity={8} distance={15} />
            )}
          </group>
        </group>
      )}

      {/* Main Highway Road Outside Entrance Gate */}
      <group position={[0, 0, depth / 2 + 10]}>
        <mesh receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[width + 300, 0.04, 16]} />
          <primitive object={mainRoadMat} attach="material" />
        </mesh>

        {/* Yellow Dashed Center Line */}
        {yellowDashPositions.map((x, i) => (
          <mesh key={`main-yellow-${i}`} position={[x, 0.05, 0]}>
            <boxGeometry args={[8, 0.01, 0.35]} />
            <primitive object={stripeYellowMat} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

