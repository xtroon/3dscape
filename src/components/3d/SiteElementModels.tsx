import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SiteElement, TimeOfDay } from '../../types/building';

interface SiteElementModelProps {
  element: SiteElement;
  timeOfDay: TimeOfDay;
  isSelected?: boolean;
}

export const SiteElementModel: React.FC<SiteElementModelProps> = ({
  element,
  timeOfDay,
  isSelected,
}) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const beamTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.55)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.18)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 256);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const width = element.width || (element.type === 'road' ? 30 : element.type === 'parking' ? 20 : 14);
  const depth = element.depth || (element.type === 'road' ? 8 : element.type === 'parking' ? 14 : 10);

  const selectionMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#10b981',
      wireframe: true,
    });
  }, []);

  switch (element.type) {
    case 'parking': {
      const bayCount = Math.max(2, Math.floor(width / 4));
      const bayPositions: number[] = [];
      const baySpacing = width / bayCount;
      for (let i = 0; i <= bayCount; i++) {
        bayPositions.push(-width / 2 + i * baySpacing);
      }

      return (
        <group>
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <boxGeometry args={[width, 0.08, depth]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={isNight || isSunset ? 0.4 : 0.8}
              metalness={isNight || isSunset ? 0.2 : 0.0}
            />
          </mesh>

          {bayPositions.map((x, i) => (
            <mesh key={`bay-${i}`} position={[x, 0.09, 0]}>
              <boxGeometry args={[0.15, 0.01, depth - 2]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          ))}

          {bayPositions.slice(0, -1).map((x, i) => {
            if (i % 2 !== 0) return null;
            const posX = x + baySpacing / 2;
            const carColors = ['#1e3a8a', '#f8fafc', '#dc2626', '#047857', '#d97706'];
            const carColor = carColors[i % carColors.length];

            return (
              <group key={`car-${i}`} position={[posX, 0.55, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[depth * 0.55, 0.8, Math.min(2.0, baySpacing * 0.8)]} />
                  <meshStandardMaterial color={carColor} roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh castShadow position={[-0.2, 0.6, 0]}>
                  <boxGeometry args={[depth * 0.3, 0.6, Math.min(1.8, baySpacing * 0.75)]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
                </mesh>
              </group>
            );
          })}

          {isSelected && (
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[width + 0.4, 0.12, depth + 0.4]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'pool': {
      const waterW = Math.max(4, width - 3);
      const waterD = Math.max(3, depth - 3);

      return (
        <group>
          <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[width, 0.2, depth]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>

          <mesh receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[waterW, 0.22, waterD]} />
            <meshPhysicalMaterial
              color="#0284c7"
              transmission={0.8}
              opacity={0.85}
              transparent
              roughness={0.1}
              metalness={0.1}
              ior={1.33}
            />
          </mesh>

          {(isNight || isSunset) && (
            <pointLight
              position={[0, 0.25, 0]}
              color="#38bdf8"
              intensity={isNight ? 18.0 : 8.0}
              distance={Math.max(14, width * 1.5)}
              decay={1.8}
            />
          )}

          <mesh position={[0, 0.21, 0]}>
            <boxGeometry args={[waterW + 0.2, 0.02, waterD + 0.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} />
          </mesh>

          {[-width / 4, 0, width / 4].map((x, i) => (
            <group key={`lounger-${i}`} position={[x, 0.3, depth / 2 - 1]}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 0.15, 1.6]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>
            </group>
          ))}

          {isSelected && (
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[width + 0.4, 0.05, depth + 0.4]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'road': {
      const dashCount = Math.max(2, Math.floor(width / 4));
      const dashPositions: number[] = [];
      const dashSpacing = width / dashCount;
      for (let i = 0; i < dashCount; i++) {
        dashPositions.push(-width / 2 + dashSpacing / 2 + i * dashSpacing);
      }

      return (
        <group>
          <mesh receiveShadow position={[0, 0.03, 0]}>
            <boxGeometry args={[width, 0.06, depth]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={isNight || isSunset ? 0.35 : 0.8}
              metalness={isNight || isSunset ? 0.3 : 0.0}
            />
          </mesh>

          {dashPositions.map((x, i) => (
            <mesh key={`dash-${i}`} position={[x, 0.07, 0]}>
              <boxGeometry args={[dashSpacing * 0.6, 0.01, 0.25]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          ))}

          {isSelected && (
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[width + 0.4, 0.1, depth + 0.4]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'park': {
      return (
        <group>
          <mesh receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[width, 0.1, depth]} />
            <meshStandardMaterial
              color={isNight ? '#064e3b' : isSunset ? '#15803d' : '#16a34a'}
              roughness={0.9}
            />
          </mesh>

          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[Math.min(3, width * 0.2), Math.min(3.3, width * 0.22), 0.6, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[Math.min(2.8, width * 0.18), Math.min(2.8, width * 0.18), 0.1, 16]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent />
          </mesh>

          {isSelected && (
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[width + 0.5, 0.2, depth + 0.5]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'clubhouse': {
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
            <boxGeometry args={[width, 5.0, depth]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 5.15, 0]}>
            <boxGeometry args={[width + 1.0, 0.3, depth + 1.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.5, depth / 2 + 0.05]}>
            <boxGeometry args={[width - 2, 4.0, 0.1]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              transmission={0.8}
              transparent
              opacity={0.7}
              emissive={isNight ? new THREE.Color('#fef08a') : new THREE.Color('#000000')}
              emissiveIntensity={isNight ? 0.6 : 0}
            />
          </mesh>

          {isSelected && (
            <mesh position={[0, 2.5, 0]}>
              <boxGeometry args={[width + 0.5, 5.4, depth + 0.5]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'tree': {
      return (
        <group>
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 3.6, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.0, 0]}>
            <sphereGeometry args={[1.8, 8, 8]} />
            <meshStandardMaterial
              color={isNight ? '#065f46' : isSunset ? '#166534' : '#22c55e'}
              roughness={0.7}
            />
          </mesh>
          <mesh castShadow position={[0, 5.2, 0]}>
            <sphereGeometry args={[1.4, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>

          {isSelected && (
            <mesh position={[0, 3.0, 0]}>
              <cylinderGeometry args={[2.0, 2.0, 6.0, 8]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'street_light': {
      const height = element.width || 5.5; // Customizable Pole Height (4m - 12m)
      const lightColor = element.lightColor || '#fbbf24'; // Customizable Bulb Color
      const lightIntensity = element.lightIntensity !== undefined ? element.lightIntensity : 18; // Customizable Brightness
      const headType = element.headType || 'single'; // Single, Double, Quad head

      const lampGlowMaterial = new THREE.MeshStandardMaterial({
        color: lightColor,
        emissive: isNight || isSunset ? new THREE.Color(lightColor) : new THREE.Color('#ffffff'),
        emissiveIntensity: isNight ? 2.5 : isSunset ? 1.2 : 0.2,
      });

      const lampPoleMat = new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.3,
        metalness: 0.8,
      });

      // Fixture arm offsets based on head configuration
      const armAngles =
        headType === 'quad'
          ? [0, Math.PI / 2, Math.PI, -Math.PI / 2]
          : headType === 'double'
          ? [0, Math.PI]
          : [0];

      return (
        <group>
          {/* Customizable Pole Height */}
          <mesh castShadow position={[0, height / 2, 0]} material={lampPoleMat}>
            <cylinderGeometry args={[0.08, 0.14, height, 8]} />
          </mesh>

          {/* Fixture Arms & Glowing Lamps */}
          {armAngles.map((angle, i) => (
            <group key={`head-${i}`} rotation={[0, angle, 0]}>
              {/* Arched Arm */}
              <mesh position={[0, height, 0.4]} rotation={[0.4, 0, 0]} material={lampPoleMat}>
                <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
              </mesh>
              {/* Fixture Bulb Head */}
              <mesh position={[0, height + 0.3, 0.8]} material={lampGlowMaterial}>
                <boxGeometry args={[0.4, 0.2, 0.6]} />
              </mesh>
              {/* Volumetric Light Beam Mesh */}
              {(isNight || isSunset) && (
                <mesh position={[0, height / 2, 0.8]}>
                  <coneGeometry args={[height * 0.24, height, 16, 1, true]} />
                  <meshBasicMaterial
                     color={lightColor}
                     map={beamTexture || undefined}
                     transparent
                     opacity={isNight ? 0.35 : 0.12}
                     blending={THREE.AdditiveBlending}
                     depthWrite={false}
                     side={THREE.DoubleSide}
                  />
                </mesh>
              )}
              {/* Active Illumination Source */}
              {(isNight || isSunset) && (
                <spotLight
                  position={[0, height + 0.2, 0.8]}
                  intensity={isNight ? lightIntensity * 3.0 : lightIntensity * 1.5}
                  color={lightColor}
                  distance={Math.max(16, height * 3.2)}
                  angle={Math.PI / 3.8}
                  penumbra={0.65}
                  decay={1.8}
                  castShadow
                  shadow-bias={-0.0005}
                />
              )}
            </group>
          ))}

          {isSelected && (
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[1.0, 1.0, height + 1.0, 8]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    default:
      return null;
  }
};
