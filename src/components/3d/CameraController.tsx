import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/building';

interface CameraControllerProps {
  preset: CameraPreset;
}

export const CameraController: React.FC<CameraControllerProps> = ({ preset }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const isLerping = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useEffect(() => {
    let pos: [number, number, number] = [0, 2.8, 45];
    let look: [number, number, number] = [0, 8, 0];

    switch (preset) {
      case 'top_site':
        // High overhead master site view looking straight down at the plot grid
        pos = [0, 150, 0.1];
        look = [0, 0, 0];
        break;

      case 'street':
        // Human street eye-level view looking at the property
        pos = [0, 2.8, 55];
        look = [0, 8, 0];
        break;

      case 'front':
        // Front site overview
        pos = [0, 30, 80];
        look = [0, 8, 0];
        break;

      case 'side':
        // Perspective side overview
        pos = [75, 35, 50];
        look = [0, 8, 0];
        break;

      case 'elevated':
        // Isometric 3D aerial view
        pos = [65, 80, 80];
        look = [0, 5, 0];
        break;
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isLerping.current = true;
  }, [preset]);

  useFrame((_, delta) => {
    if (!isLerping.current || !controlsRef.current) return;

    // Lerp camera position
    camera.position.lerp(targetPos.current, delta * 4);

    // Lerp controls target
    controlsRef.current.target.lerp(targetLook.current, delta * 4);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetPos.current) < 0.2 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.2
    ) {
      isLerping.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.01} // Prevent camera going below ground level
      minDistance={10}
      maxDistance={250}
      target={[0, 0, 0]}
    />
  );
};
