import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/building';

interface CameraControllerProps {
  preset: CameraPreset;
  focusTarget?: [number, number, number] | null;
}

export const CameraController: React.FC<CameraControllerProps> = ({ preset, focusTarget }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const isLerping = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside text inputs
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let pos: [number, number, number] = [0, 2.8, 45];
    let look: [number, number, number] = [0, 8, 0];

    if (focusTarget) {
      look = [focusTarget[0], 2, focusTarget[2]];
      pos = [focusTarget[0], 10, focusTarget[2] + 24];
    } else {
      switch (preset) {
        case 'top_site':
          pos = [0, 140, 0.1];
          look = [0, 0, 0];
          break;

        case 'street_walk':
          pos = [0, 1.8, 25];
          look = [0, 2.2, 0];
          break;

        case 'street':
          pos = [0, 2.8, 55];
          look = [0, 8, 0];
          break;

        case 'front':
          pos = [0, 30, 80];
          look = [0, 8, 0];
          break;

        case 'side':
          pos = [75, 35, 50];
          look = [0, 8, 0];
          break;

        case 'elevated':
          pos = [65, 80, 80];
          look = [0, 5, 0];
          break;
      }
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isLerping.current = true;
  }, [preset, focusTarget]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Smooth Keyboard Navigation (WASD / Arrow Keys)
    const keys = keysPressed.current;
    if (keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright']) {
      isLerping.current = false;

      const speed = preset === 'street_walk' ? 16.0 * delta : 28.0 * delta;
      const moveVector = new THREE.Vector3();

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

      if (keys['w'] || keys['arrowup']) moveVector.addScaledVector(dir, speed);
      if (keys['s'] || keys['arrowdown']) moveVector.addScaledVector(dir, -speed);
      if (keys['d'] || keys['arrowright']) moveVector.addScaledVector(right, -speed);
      if (keys['a'] || keys['arrowleft']) moveVector.addScaledVector(right, speed);

      camera.position.add(moveVector);
      controlsRef.current.target.add(moveVector);

      if (preset === 'street_walk') {
        camera.position.y = 1.8;
      }

      controlsRef.current.update();
      return;
    }

    // Buttery Smooth Cubic Lerp for Preset & Target Transitions
    if (isLerping.current) {
      const lerpSpeed = delta * 5.5;
      camera.position.lerp(targetPos.current, lerpSpeed);
      controlsRef.current.target.lerp(targetLook.current, lerpSpeed);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetPos.current) < 0.1 &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.1
      ) {
        isLerping.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.08} // Buttery smooth fluid damping
      rotateSpeed={0.8}
      zoomSpeed={1.1}
      enablePan={true}
      screenSpacePanning={false} // Pan along ground plane naturally
      panSpeed={1.4}
      maxPolarAngle={preset === 'street_walk' ? Math.PI / 2 - 0.001 : Math.PI / 2 - 0.02}
      minDistance={1.2}
      maxDistance={280}
      target={[0, 0, 0]}
    />
  );
};
