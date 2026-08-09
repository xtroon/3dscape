import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset, SiteBuilding } from '../../types/building';

interface CameraControllerProps {
  preset: CameraPreset;
  focusTarget?: [number, number, number] | null;
  doubleClickTarget?: [number, number, number] | null;
  buildings?: SiteBuilding[];
  plotSize?: [number, number];
  onExitStreetView?: () => void;
  virtualKeys?: { w: boolean; a: boolean; s: boolean; d: boolean };
  isMobile?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  focusTarget,
  doubleClickTarget,
  buildings,
  plotSize,
  onExitStreetView,
  virtualKeys,
  isMobile,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl } = useThree();

  const isLerping = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  const keysPressed = useRef<Record<string, boolean>>({});

  const [isModifierPressed, setIsModifierPressed] = useState(false);

  const presetRef = useRef(preset);
  const buildingsRef = useRef(buildings);
  const plotSizeRef = useRef(plotSize);
  const virtualKeysRef = useRef(virtualKeys);
  const isMobileRef = useRef(isMobile);

  useEffect(() => { presetRef.current = preset; }, [preset]);
  useEffect(() => { buildingsRef.current = buildings; }, [buildings]);
  useEffect(() => { plotSizeRef.current = plotSize; }, [plotSize]);
  useEffect(() => { virtualKeysRef.current = virtualKeys; }, [virtualKeys]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === 'Control' || e.key === 'Shift') {
        setIsModifierPressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      if (e.key === 'Control' || e.key === 'Shift') {
        setIsModifierPressed(false);
      }
    };
    const handleBlur = () => {
      keysPressed.current = {};
      setIsModifierPressed(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const wasLocked = useRef(false);

  useEffect(() => {
    const handleLockChange = () => {
      const locked = !!document.pointerLockElement;
      if (locked) {
        wasLocked.current = true;
        isLerping.current = false;
      } else if (wasLocked.current) {
        wasLocked.current = false;
        if (preset === 'street' && onExitStreetView) {
          onExitStreetView();
        }
      }
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, [preset, onExitStreetView]);

  useEffect(() => {
    // If not in Street View or not mobile, do not activate touch look-around
    const currentPreset = presetRef.current;
    const isMobileDevice = isMobileRef.current;
    if (currentPreset !== 'street' || !isMobileDevice) return;

    const dom = gl.domElement;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(camera.quaternion);

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('.pointer-events-auto')) return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      prevX = e.clientX;
      prevY = e.clientY;

      euler.y -= deltaX * 0.0035;
      euler.x -= deltaY * 0.0035;

      euler.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.x));

      camera.quaternion.setFromEuler(euler);
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [preset, isMobile, camera, gl]);

  useEffect(() => {
    let pos: [number, number, number] = [0, 120, 80];
    let look: [number, number, number] = [0, 0, 0];

    if (focusTarget) {
      look = [focusTarget[0], 2, focusTarget[2]];
      pos = [focusTarget[0], 12, focusTarget[2] + 28];
    } else {
      switch (preset) {
        case 'master_map':
          // Google Maps / Earth Style 3D Overhead Exploration
          pos = [0, 120, 80];
          look = [0, 0, 0];
          break;

        case 'street':
          // Human Eye-Level Street View walking height
          pos = [0, 1.8, 25];
          look = [0, 1.8, 24.9]; // 0.1 units in front to allow in-place head rotation
          break;
      }
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isLerping.current = true;
  }, [preset, focusTarget]);

  useEffect(() => {
    if (!doubleClickTarget || !controlsRef.current) return;

    const clickPoint = new THREE.Vector3(doubleClickTarget[0], doubleClickTarget[1], doubleClickTarget[2]);
    const currentTarget = controlsRef.current.target;

    const deltaX = clickPoint.x - currentTarget.x;
    const deltaY = clickPoint.y - currentTarget.y;
    const deltaZ = clickPoint.z - currentTarget.z;

    targetLook.current.copy(clickPoint);
    targetPos.current.set(
      camera.position.x + deltaX,
      camera.position.y + deltaY,
      camera.position.z + deltaZ
    );
    isLerping.current = true;
  }, [doubleClickTarget, camera]);

  useFrame((_, delta) => {
    const currentPreset = presetRef.current;
    const isStreetLevel = currentPreset === 'street';

    // 1. Smooth Camera Transition Lerp
    if (isLerping.current) {
      const lerpSpeed = delta * 5.0;
      camera.position.lerp(targetPos.current, lerpSpeed);
      
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, lerpSpeed);
        controlsRef.current.update();
      } else {
        camera.lookAt(targetLook.current);
      }

      if (camera.position.distanceTo(targetPos.current) < 0.1) {
        isLerping.current = false;
      }
    }

    // 2. Navigation Inputs
    if (isStreetLevel) {
      // First Person WASD Walking with Collision
      const keys = {
        ...keysPressed.current,
        ...(virtualKeysRef.current || {}),
      };
      if (keys['w'] || keys['s'] || keys['a'] || keys['d']) {
        isLerping.current = false;

        const speed = 15.0 * delta; // Realistic walking speed
        const moveVector = new THREE.Vector3();

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0; // Lock walking strictly to XZ ground plane
        if (dir.lengthSq() < 0.001) {
          const tempDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          tempDir.y = 0;
          if (tempDir.lengthSq() > 0.001) {
            dir.copy(tempDir);
          } else {
            dir.set(0, 0, -1);
          }
        }
        dir.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

        if (keys['w']) moveVector.addScaledVector(dir, speed);
        if (keys['s']) moveVector.addScaledVector(dir, -speed);
        if (keys['a']) moveVector.addScaledVector(right, -speed); // Move left (negative right)
        if (keys['d']) moveVector.addScaledVector(right, speed);  // Move right (positive right)

        // Compute proposed position
        const newPos = camera.position.clone().add(moveVector);

        // Boundary checks (plotSize)
        const currentPlotSize = plotSizeRef.current;
        if (currentPlotSize) {
          const halfWidth = currentPlotSize[0] / 2;
          const halfDepth = currentPlotSize[1] / 2;
          newPos.x = Math.max(-halfWidth, Math.min(halfWidth, newPos.x));
          newPos.z = Math.max(-halfDepth, Math.min(halfDepth, newPos.z));
        }

        // Bounding-sphere collision detection with buildings
        let collision = false;
        const currentBuildings = buildingsRef.current;
        if (currentBuildings) {
          for (const b of currentBuildings) {
            const dx = newPos.x - b.position[0];
            const dz = newPos.z - b.position[2];
            const distSq = dx * dx + dz * dz;
            // Width or Depth bounding radius check
            const radius = Math.max(b.config.width, b.config.depth) * 0.75;
            if (distSq < radius * radius) {
              collision = true;
              break;
            }
          }
        }

        if (!collision) {
          if (controlsRef.current) {
            camera.position.add(moveVector);
            controlsRef.current.target.add(moveVector);
            controlsRef.current.update();
          } else {
            camera.position.copy(newPos);
          }
        }
      }

      // Lock height to walking eye level
      camera.position.y = 1.8;
      if (controlsRef.current) {
        controlsRef.current.target.y = 1.8;
      }
    } else {
      // Normal View Keyboard Panning (WASD/Arrows)
      if (!controlsRef.current) return;
      const keys = keysPressed.current;
      if (
        keys['w'] || keys['s'] || keys['a'] || keys['d'] ||
        keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright']
      ) {
        isLerping.current = false;

        const speed = 32.0 * delta;
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
        controlsRef.current.update();
      }
    }
  });

  const isStreetLevel = preset === 'street';

  if (isStreetLevel) {
    if (!isMobile) {
      return <PointerLockControls />;
    }
    return null;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.08} // Smooth fluid inertia glide
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      enablePan={true} // Free ground panning like Google Maps / Earth
      screenSpacePanning={false} // Pan along XZ ground plane naturally
      panSpeed={1.8}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={1.2}
      maxDistance={300}
      onStart={() => {
        isLerping.current = false;
      }}
    />
  );
};
