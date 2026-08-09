import React from 'react';
import * as THREE from 'three';
import { BuildingConfig } from '../../types/building';

interface SurroundingsProps {
  config: BuildingConfig;
}

export const Surroundings: React.FC<SurroundingsProps> = ({ config }) => {
  const { showParking, showStreetLights, timeOfDay } = config;

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  // Materials
  const roadMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.8,
    metalness: 0.1,
  });

  const stripeYellowMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.4,
  });

  const stripeWhiteMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.4,
  });

  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.6,
    metalness: 0.1,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: '#64748b',
    roughness: 0.5,
  });

  const grassMat = new THREE.MeshStandardMaterial({
    color: isNight ? '#064e3b' : isSunset ? '#15803d' : '#16a34a',
    roughness: 0.9,
    metalness: 0.05,
  });

  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#78350f',
    roughness: 0.9,
  });

  const foliageMat1 = new THREE.MeshStandardMaterial({
    color: isNight ? '#065f46' : isSunset ? '#166534' : '#22c55e',
    roughness: 0.7,
  });

  const foliageMat2 = new THREE.MeshStandardMaterial({
    color: isNight ? '#047857' : isSunset ? '#15803d' : '#15803d',
    roughness: 0.7,
  });

  const lampPoleMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.3,
    metalness: 0.8,
  });

  const lampGlowMat = new THREE.MeshStandardMaterial({
    color: '#fef08a',
    emissive: isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff'),
    emissiveIntensity: isNight ? 2.0 : isSunset ? 1.0 : 0.2,
  });

  const bgBuildingMat = new THREE.MeshStandardMaterial({
    color: isNight ? '#0f172a' : isSunset ? '#334155' : '#475569',
    roughness: 0.8,
    metalness: 0.1,
  });

  // Tree positions list
  const treePositions: [number, number][] = [
    [-18, 10], [18, 10], [-24, 10], [24, 10],
    [-20, -12], [20, -12], [-10, -15], [10, -15],
    [-28, -2], [28, -2], [26, 18], [-26, 18],
  ];

  // Street light positions
  const streetLightPositions: [number, number][] = [
    [-15, 11], [-5, 11], [5, 11], [15, 11],
  ];

  return (
    <group>
      {/* Ground Grass Lawn (Base) */}
      <mesh receiveShadow position={[0, -0.05, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 100]} />
        <primitive object={grassMat} attach="material" />
      </mesh>

      {/* Concrete Sidewalk Area */}
      <group position={[0, 0, 9.5]}>
        {/* Sidewalk Slab */}
        <mesh receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[100, 0.16, 7]} />
          <primitive object={sidewalkMat} attach="material" />
        </mesh>
        {/* Raised Curb Edge */}
        <mesh receiveShadow position={[0, 0.12, 3.55]}>
          <boxGeometry args={[100, 0.24, 0.3]} />
          <primitive object={curbMat} attach="material" />
        </mesh>
      </group>

      {/* Main Two-Lane Road */}
      <group position={[0, 0, 19]}>
        {/* Road Base */}
        <mesh receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[120, 0.04, 11]} />
          <primitive object={roadMat} attach="material" />
        </mesh>

        {/* Yellow Dashed Center Line */}
        {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((x, i) => (
          <mesh key={`yellow-${i}`} position={[x, 0.05, 0]}>
            <boxGeometry args={[4, 0.01, 0.3]} />
            <primitive object={stripeYellowMat} attach="material" />
          </mesh>
        ))}

        {/* White Edge Lines */}
        <mesh position={[0, 0.05, -5]}>
          <boxGeometry args={[120, 0.01, 0.2]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 5]}>
          <boxGeometry args={[120, 0.01, 0.2]} />
          <primitive object={stripeWhiteMat} attach="material" />
        </mesh>

        {/* Pedestrian Crosswalk (In front of entrance) */}
        {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x, i) => (
          <mesh key={`crosswalk-${i}`} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.8, 0.015, 8.5]} />
            <primitive object={stripeWhiteMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Street Lights */}
      {showStreetLights &&
        streetLightPositions.map(([x, z], i) => (
          <group key={`street-light-${i}`} position={[x, 0, z]}>
            {/* Pole */}
            <mesh castShadow position={[0, 2.5, 0]} material={lampPoleMat}>
              <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
            </mesh>
            {/* Arm */}
            <mesh position={[0, 5.0, 0.4]} rotation={[0.4, 0, 0]} material={lampPoleMat}>
              <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
            </mesh>
            {/* Fixture head */}
            <mesh position={[0, 5.3, 0.8]} material={lampGlowMat}>
              <boxGeometry args={[0.4, 0.2, 0.6]} />
            </mesh>
            {/* Light Source */}
            {(isNight || isSunset) && (
              <pointLight
                position={[0, 5.2, 0.8]}
                intensity={isNight ? 18 : 10}
                color="#fbbf24"
                distance={14}
                decay={2}
                castShadow
              />
            )}
          </group>
        ))}

      {/* Parking Lot Area */}
      {showParking && (
        <group position={[-25, 0, 0]}>
          {/* Parking Asphalt Pad */}
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <boxGeometry args={[16, 0.08, 18]} />
            <primitive object={roadMat} attach="material" />
          </mesh>
          {/* Parking Bay Stripe Lines */}
          {[-6, -2, 2, 6].map((x, i) => (
            <group key={`bay-${i}`} position={[x, 0.09, 0]}>
              <mesh position={[0, 0, -4]}>
                <boxGeometry args={[0.15, 0.01, 7]} />
                <primitive object={stripeWhiteMat} attach="material" />
              </mesh>
              <mesh position={[0, 0, 4]}>
                <boxGeometry args={[0.15, 0.01, 7]} />
                <primitive object={stripeWhiteMat} attach="material" />
              </mesh>
            </group>
          ))}

          {/* Parked 3D Cars */}
          {/* Car 1: Blue Sedan */}
          <group position={[-4, 0.6, -4]} rotation={[0, Math.PI / 2, 0]}>
            {/* Body */}
            <mesh castShadow position={[0, 0.3, 0]}>
              <boxGeometry args={[4.2, 0.8, 1.9]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Cabin */}
            <mesh castShadow position={[-0.2, 0.85, 0]}>
              <boxGeometry args={[2.2, 0.6, 1.7]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Headlights */}
            <mesh position={[2.11, 0.3, 0.6]}>
              <boxGeometry args={[0.05, 0.2, 0.4]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[2.11, 0.3, -0.6]}>
              <boxGeometry args={[0.05, 0.2, 0.4]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Car 2: White SUV */}
          <group position={[0, 0.7, 4]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh castShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[4.6, 1.1, 2.0]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
            </mesh>
            <mesh castShadow position={[-0.3, 1.1, 0]}>
              <boxGeometry args={[2.6, 0.75, 1.85]} />
              <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.8} />
            </mesh>
          </group>

          {/* Car 3: Red Coupe */}
          <group position={[4, 0.55, -4]} rotation={[0, Math.PI / 2, 0]}>
            <mesh castShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[4.0, 0.7, 1.85]} />
              <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[-0.1, 0.75, 0]}>
              <boxGeometry args={[2.0, 0.55, 1.6]} />
              <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        </group>
      )}

      {/* Trees & Vegetation */}
      {treePositions.map(([x, z], i) => {
        const heightScale = 1 + (i % 3) * 0.2;
        return (
          <group key={`tree-${i}`} position={[x, 0, z]} scale={[1, heightScale, 1]}>
            {/* Trunk */}
            <mesh castShadow position={[0, 1.8, 0]} material={trunkMat}>
              <cylinderGeometry args={[0.25, 0.35, 3.6, 8]} />
            </mesh>
            {/* Foliage Layers */}
            <mesh castShadow position={[0, 4.0, 0]} material={foliageMat1}>
              <sphereGeometry args={[1.8, 8, 8]} />
            </mesh>
            <mesh castShadow position={[0, 5.2, 0]} material={foliageMat2}>
              <sphereGeometry args={[1.4, 8, 8]} />
            </mesh>
            <mesh castShadow position={[0, 6.1, 0]} material={foliageMat1}>
              <sphereGeometry args={[0.9, 8, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* Background Neighborhood Silhouette Buildings */}
      <group position={[-42, 0, -25]}>
        <mesh castShadow position={[0, 10, 0]} material={bgBuildingMat}>
          <boxGeometry args={[18, 20, 16]} />
        </mesh>
      </group>
      <group position={[42, 0, -25]}>
        <mesh castShadow position={[0, 12, 0]} material={bgBuildingMat}>
          <boxGeometry args={[20, 24, 18]} />
        </mesh>
      </group>
      <group position={[0, 0, -40]}>
        <mesh castShadow position={[0, 15, 0]} material={bgBuildingMat}>
          <boxGeometry args={[45, 30, 15]} />
        </mesh>
      </group>
    </group>
  );
};
