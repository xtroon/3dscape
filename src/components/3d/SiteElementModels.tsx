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
      // Dynamic bay line positions based on custom width
      const bayCount = Math.max(2, Math.floor(width / 4));
      const bayPositions: number[] = [];
      const baySpacing = width / bayCount;
      for (let i = 0; i <= bayCount; i++) {
        bayPositions.push(-width / 2 + i * baySpacing);
      }

      return (
        <group>
          {/* Parking Asphalt Pad */}
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <boxGeometry args={[width, 0.08, depth]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Dynamic White Bay Stripe Lines */}
          {bayPositions.map((x, i) => (
            <mesh key={`bay-${i}`} position={[x, 0.09, 0]}>
              <boxGeometry args={[0.15, 0.01, depth - 2]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          ))}

          {/* Parked 3D Cars in Bay Stalls */}
          {bayPositions.slice(0, -1).map((x, i) => {
            if (i % 2 !== 0) return null; // Park cars in alternating stalls
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
          {/* Deck Surround */}
          <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[width, 0.2, depth]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>

          {/* Water Pool Basin */}
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

          {/* Tile Border */}
          <mesh position={[0, 0.21, 0]}>
            <boxGeometry args={[waterW + 0.2, 0.02, waterD + 0.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} />
          </mesh>

          {/* Lounger Chairs */}
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
          {/* Asphalt Strip */}
          <mesh receiveShadow position={[0, 0.03, 0]}>
            <boxGeometry args={[width, 0.06, depth]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Center White Dashes */}
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
          {/* Park Grass Pad */}
          <mesh receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[width, 0.1, depth]} />
            <meshStandardMaterial
              color={isNight ? '#064e3b' : isSunset ? '#15803d' : '#16a34a'}
              roughness={0.9}
            />
          </mesh>

          {/* Fountain Basin */}
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
      return (
        <group>
          <mesh castShadow position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 5.0, 0.4]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 5.3, 0.8]}>
            <boxGeometry args={[0.4, 0.2, 0.6]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive={isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff')}
              emissiveIntensity={isNight ? 2.0 : isSunset ? 1.0 : 0.2}
            />
          </mesh>
          {(isNight || isSunset) && (
            <pointLight
              position={[0, 5.2, 0.8]}
              intensity={isNight ? 18 : 10}
              color="#fbbf24"
              distance={16}
              decay={2}
              castShadow
            />
          )}

          {isSelected && (
            <mesh position={[0, 2.7, 0.4]}>
              <cylinderGeometry args={[0.8, 0.8, 5.5, 8]} />
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
