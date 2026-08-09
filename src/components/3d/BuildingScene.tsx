import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows } from '@react-three/drei';

import { BuildingConfig, CameraPreset } from '../../types/building';
import { ProceduralBuilding } from './ProceduralBuilding';
import { Surroundings } from './Surroundings';
import { CameraController } from './CameraController';

interface BuildingSceneProps {
  config: BuildingConfig;
  preset: CameraPreset;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const BuildingScene: React.FC<BuildingSceneProps> = ({ config, preset, canvasRef }) => {
  const { timeOfDay } = config;

  // Environment & Light parameters by time of day
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const sunPosition: [number, number, number] = isNight
    ? [-100, -20, -100]
    : isSunset
    ? [80, 8, -40]
    : [40, 50, 30];

  const sunColor = isNight ? '#38bdf8' : isSunset ? '#fb923c' : '#ffffff';
  const dirLightIntensity = isNight ? 0.35 : isSunset ? 1.6 : 2.2;
  const ambientIntensity = isNight ? 0.25 : isSunset ? 0.5 : 0.7;
  const fogColor = isNight ? '#090d16' : isSunset ? '#451a03' : '#cbd5e1';

  return (
    <div className="relative h-full w-full bg-slate-950">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 2.2, 24], fov: 48 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
        className="h-full w-full"
      >
        {/* Background Fog */}
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 25, 100]} />

        {/* Ambient & Hemisphere Lighting */}
        <ambientLight intensity={ambientIntensity} color={sunColor} />
        <hemisphereLight
          intensity={isNight ? 0.2 : isSunset ? 0.4 : 0.6}
          color={isNight ? '#1e293b' : isSunset ? '#fdba74' : '#bae6fd'}
          groundColor={isNight ? '#020617' : isSunset ? '#451a03' : '#14532d'}
        />

        {/* Main Sun/Moon Directional Light with Shadows */}
        <directionalLight
          position={sunPosition}
          intensity={dirLightIntensity}
          color={sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={40}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0001}
        />

        {/* Fill Light */}
        <directionalLight
          position={[-30, 20, -20]}
          intensity={isNight ? 0.1 : 0.4}
          color="#93c5fd"
        />

        {/* Dynamic Sky */}
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={isSunset ? 0.52 : isNight ? 0.0 : 0.6}
          azimuth={isSunset ? 0.25 : 0.1}
          turbidity={isSunset ? 8 : 2}
          rayleigh={isSunset ? 6 : 1}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* Building & Surroundings */}
        <group position={[0, 0, 0]}>
          <ProceduralBuilding config={config} />
          <Surroundings config={config} />
        </group>

        {/* High-quality Ground Contact Shadow under Building */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.7}
          scale={40}
          blur={1.5}
          far={10}
          resolution={1024}
          color="#000000"
        />

        {/* Camera Preset Controller */}
        <CameraController preset={preset} floors={config.floors} />
      </Canvas>
    </div>
  );
};
