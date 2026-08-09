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

  // Keyboard state for WASD street walking mode
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Update preset target positions
  useEffect(() => {
    let pos: [number, number, number] = [0, 2.8, 45];
    let look: [number, number, number] = [0, 8, 0];

    if (focusTarget) {
      look = [focusTarget[0], 4, focusTarget[2]];
      pos = [focusTarget[0], 12, focusTarget[2] + 28];
    } else {
      switch (preset) {
        case 'top_site':
          pos = [0, 150, 0.1];
          look = [0, 0, 0];
          break;

        case 'street_walk':
          // Human Eye-Level Street Walk Mode (Height = 1.8m)
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

    // Handle WASD Keyboard Walking Navigation when in street_walk or active navigation
    const keys = keysPressed.current;
    if (keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright']) {
      isLerping.current = false; // Override lerp with real-time walking input

      const speed = preset === 'street_walk' ? 18.0 * delta : 30.0 * delta;
      const moveVector = new THREE.Vector3();

      // Get camera forward direction projected on ground plane
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize();

      // Right vector perpendicular to direction
      const right = new THREE.Vector3();
      right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

      if (keys['w'] || keys['arrowup']) moveVector.addScaledVector(dir, speed);
      if (keys['s'] || keys['arrowdown']) moveVector.addScaledVector(dir, -speed);
      if (keys['d'] || keys['arrowright']) moveVector.addScaledVector(right, -speed);
      if (keys['a'] || keys['arrowleft']) moveVector.addScaledVector(right, speed);

      // Move both camera and OrbitControls target together across the plot
      camera.position.add(moveVector);
      controlsRef.current.target.add(moveVector);

      // In street_walk mode, lock camera Y height to human eye level (~1.8m)
      if (preset === 'street_walk') {
        camera.position.y = 1.8;
      }

      controlsRef.current.update();
      return;
    }

    // Camera preset smooth transition lerp
    if (isLerping.current) {
      camera.position.lerp(targetPos.current, delta * 4);
      controlsRef.current.target.lerp(targetLook.current, delta * 4);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetPos.current) < 0.2 &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.2
      ) {
        isLerping.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enablePan={true} // Allow panning across the entire 200m x 200m land plot!
      screenSpacePanning={false} // Pan along ground plane XZ
      panSpeed={1.5}
      maxPolarAngle={preset === 'street_walk' ? Math.PI / 2 - 0.001 : Math.PI / 2 - 0.01}
      minDistance={1.2} // Allow coming close up to any street lamp, tree, or building facade
      maxDistance={280}
      target={[0, 0, 0]}
    />
  );
};
