import React, { useRef, useEffect } from 'react';
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
  eyeHeight?: number;
  quickTurnAngle?: number | null;
  onQuickTurnProcessed?: () => void;
  onTelemetryUpdate?: (info: { heading: number; position: [number, number, number] }) => void;
  onActiveKeyboardKeysChange?: (keys: { w: boolean; a: boolean; s: boolean; d: boolean; shift: boolean }) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  focusTarget,
  doubleClickTarget,
  buildings,
  plotSize,
  eyeHeight = 1.8,
  quickTurnAngle,
  onQuickTurnProcessed,
  onTelemetryUpdate,
  onActiveKeyboardKeysChange,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl } = useThree();

  const isLerping = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  const keysPressed = useRef<Record<string, boolean>>({});

  const presetRef = useRef(preset);
  const buildingsRef = useRef(buildings);
  const plotSizeRef = useRef(plotSize);
  const eyeHeightRef = useRef(eyeHeight);
  const onTelemetryUpdateRef = useRef(onTelemetryUpdate);
  const onActiveKeyboardKeysChangeRef = useRef(onActiveKeyboardKeysChange);

  useEffect(() => { presetRef.current = preset; }, [preset]);
  useEffect(() => { buildingsRef.current = buildings; }, [buildings]);
  useEffect(() => { plotSizeRef.current = plotSize; }, [plotSize]);
  useEffect(() => { eyeHeightRef.current = eyeHeight; }, [eyeHeight]);
  useEffect(() => { onTelemetryUpdateRef.current = onTelemetryUpdate; }, [onTelemetryUpdate]);
  useEffect(() => { onActiveKeyboardKeysChangeRef.current = onActiveKeyboardKeysChange; }, [onActiveKeyboardKeysChange]);

  // Handle Keyboard listeners & key status updates
  useEffect(() => {
    const reportKeyStatus = () => {
      if (onActiveKeyboardKeysChangeRef.current) {
        onActiveKeyboardKeysChangeRef.current({
          w: !!keysPressed.current['w'],
          a: !!keysPressed.current['a'],
          s: !!keysPressed.current['s'],
          d: !!keysPressed.current['d'],
          shift: !!keysPressed.current['shift'],
        });
      }
    };

    const isMovementKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();

      return (
        key === 'w' || key === 'a' || key === 's' || key === 'd' ||
        key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' ||
        code === 'keyw' || code === 'keya' || code === 'keys' || code === 'keyd'
      );
    };

    const setMovementState = (e: KeyboardEvent, pressed: boolean) => {
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();

      if (key === 'w' || key === 'arrowup' || code === 'keyw') keysPressed.current['w'] = pressed;
      if (key === 's' || key === 'arrowdown' || code === 'keys') keysPressed.current['s'] = pressed;
      if (key === 'a' || key === 'arrowleft' || code === 'keya') keysPressed.current['a'] = pressed;
      if (key === 'd' || key === 'arrowright' || code === 'keyd') keysPressed.current['d'] = pressed;
      if (key === 'shift' || code.includes('shift')) keysPressed.current['shift'] = pressed;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (isMovementKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }

      setMovementState(e, true);

      reportKeyStatus();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isMovementKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }

      setMovementState(e, false);

      reportKeyStatus();
    };

    const handleBlur = () => {
      keysPressed.current = {};
      reportKeyStatus();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Quick turn processing
  useEffect(() => {
    if (quickTurnAngle != null && preset === 'street') {
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);
      euler.y += (quickTurnAngle * Math.PI) / 180;
      camera.quaternion.setFromEuler(euler);
      if (onQuickTurnProcessed) onQuickTurnProcessed();
    }
  }, [quickTurnAngle, preset, camera, onQuickTurnProcessed]);

  // Pointer drag 360° mouse / touch look when PointerLock is unlocked or inactive
  useEffect(() => {
    const currentPreset = presetRef.current;
    if (currentPreset !== 'street') return;

    const dom = gl.domElement;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks on UI overlay buttons
      if ((e.target as HTMLElement)?.closest('.pointer-events-auto')) return;
      if (document.pointerLockElement) return; // Handled by PointerLockControls

      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      euler.setFromQuaternion(camera.quaternion);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || document.pointerLockElement) return;

      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      prevX = e.clientX;
      prevY = e.clientY;

      euler.y -= deltaX * 0.0035;
      euler.x -= deltaY * 0.0035;

      euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.x));

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
  }, [preset, camera, gl]);

  // Initial Camera Positioning when changing presets
  useEffect(() => {
    let pos: [number, number, number] = [0, 120, 80];
    let look: [number, number, number] = [0, 0, 0];

    if (focusTarget) {
      look = [focusTarget[0], 2, focusTarget[2]];
      pos = [focusTarget[0], 12, focusTarget[2] + 28];
    } else {
      switch (preset) {
        case 'master_map':
          pos = [0, 220, 180];
          look = [0, 0, 0];
          break;


        case 'street':
          pos = [0, eyeHeight, 25];
          look = [0, eyeHeight, 24.9];
          break;
      }
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isLerping.current = true;
  }, [preset, focusTarget, eyeHeight]);

  // Double click position lerp
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
      const keys = keysPressed.current;

      const isWalking = keys['w'] || keys['s'] || keys['a'] || keys['d'];

      if (isWalking) {
        isLerping.current = false;

        const isSprint = keys['shift'];
        const baseSpeed = isSprint ? 30.0 : 15.0;
        const speed = baseSpeed * delta;

        const moveVector = new THREE.Vector3();

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
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

        // Keyboard WASD & Arrow Keys movement
        if (keys['w']) moveVector.addScaledVector(dir, speed);
        if (keys['s']) moveVector.addScaledVector(dir, -speed);
        if (keys['a']) moveVector.addScaledVector(right, -speed);
        if (keys['d']) moveVector.addScaledVector(right, speed);

        const newPos = camera.position.clone().add(moveVector);

        // Plot Boundary limits
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

      // Lock camera height to current eye height setting
      const targetEyeHeight = eyeHeightRef.current || 1.8;
      camera.position.y = targetEyeHeight;
      if (controlsRef.current) {
        controlsRef.current.target.y = targetEyeHeight;
      }

      // Telemetry reporting (heading degrees & position)
      if (onTelemetryUpdateRef.current) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        let rad = Math.atan2(dir.x, -dir.z);
        let deg = (rad * 180) / Math.PI;
        if (deg < 0) deg += 360;

        onTelemetryUpdateRef.current({
          heading: deg,
          position: [camera.position.x, camera.position.y, camera.position.z],
        });
      }
    } else {
      // Master Map Keyboard Panning (WASD/Arrows)
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
    return <PointerLockControls />;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.08}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      enablePan={true}
      screenSpacePanning={false}
      panSpeed={1.8}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={1.2}
      maxDistance={2500}
      onStart={() => {
        isLerping.current = false;
      }}
    />
  );
};
