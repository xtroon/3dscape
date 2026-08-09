import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/building';

interface CameraControllerProps {
  preset: CameraPreset;
  floors: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({ preset, floors }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const isLerping = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  // Calculate dynamic target look-at Y based on building height
  const buildingHeight = 4.2 + (floors - 1) * 3.2;

  useEffect(() => {
    let pos: [number, number, number] = [0, 2.2, 24];
    let look: [number, number, number] = [0, Math.min(buildingHeight * 0.4, 8), 0];

    switch (preset) {
      case 'street':
        // Human street eye-level view looking up at the apartment
        pos = [0, 2.2, 24];
        look = [0, Math.min(buildingHeight * 0.45, 10), 0];
        break;

      case 'front':
        // Straight front architectural elevation view
        pos = [0, Math.max(buildingHeight * 0.5, 4), 30];
        look = [0, buildingHeight * 0.5, 0];
        break;

      case 'side':
        // Perspective side profile view
        pos = [28, Math.max(buildingHeight * 0.5, 4), 16];
        look = [0, buildingHeight * 0.4, 0];
        break;

      case 'elevated':
        // High bird's eye / isometric aerial view
        pos = [26, Math.max(buildingHeight * 1.1 + 8, 16), 32];
        look = [0, buildingHeight * 0.35, 0];
        break;
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isLerping.current = true;
  }, [preset, floors, buildingHeight]);

  useFrame((_, delta) => {
    if (!isLerping.current || !controlsRef.current) return;

    // Smooth lerp camera position
    camera.position.lerp(targetPos.current, delta * 4);

    // Smooth lerp controls target
    controlsRef.current.target.lerp(targetLook.current, delta * 4);
    controlsRef.current.update();

    // Check if transition close enough to stop lerp
    if (
      camera.position.distanceTo(targetPos.current) < 0.1 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.1
    ) {
      isLerping.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera going below ground level
      minDistance={6}
      maxDistance={70}
      target={[0, Math.min(buildingHeight * 0.4, 8), 0]}
    />
  );
};
