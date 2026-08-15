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

  const width = element.width || (element.type === 'road' ? 30 : element.type === 'parking' ? 20 : element.type === 'waterfall' ? 24 : 14);
  const depth = element.depth || (element.type === 'road' ? 8 : element.type === 'parking' ? 14 : element.type === 'waterfall' ? 18 : 10);

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
          {/* Main Asphalt Foundation */}
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <boxGeometry args={[width, 0.08, depth]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={isNight || isSunset ? 0.4 : 0.8}
              metalness={isNight || isSunset ? 0.2 : 0.05}
            />
          </mesh>

          {/* Concrete Perimeter Curbing */}
          <mesh receiveShadow position={[0, 0.1, -depth / 2 - 0.1]}>
            <boxGeometry args={[width + 0.4, 0.16, 0.3]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
          <mesh receiveShadow position={[0, 0.1, depth / 2 + 0.1]}>
            <boxGeometry args={[width + 0.4, 0.16, 0.3]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>

          {/* Marked White Bay Stripe Lines */}
          {bayPositions.map((x, i) => (
            <mesh key={`bay-${i}`} position={[x, 0.09, 0]}>
              <boxGeometry args={[0.18, 0.01, depth - 1.8]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          ))}

          {/* Wheel Stops (Concrete Curbs at end of stalls) */}
          {bayPositions.slice(0, -1).map((x, i) => {
            const posX = x + baySpacing / 2;
            return (
              <group key={`wheelstop-${i}`}>
                <mesh castShadow receiveShadow position={[posX, 0.12, -depth / 2 + 1.2]}>
                  <boxGeometry args={[baySpacing * 0.7, 0.14, 0.25]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
                <mesh castShadow receiveShadow position={[posX, 0.12, depth / 2 - 1.2]}>
                  <boxGeometry args={[baySpacing * 0.7, 0.14, 0.25]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
              </group>
            );
          })}

          {/* Realistic 3D Parked Vehicles */}
          {bayPositions.slice(0, -1).map((x, i) => {
            if (i % 2 !== 0) return null;
            const posX = x + baySpacing / 2;
            const carColors = ['#1e3a8a', '#f8fafc', '#dc2626', '#047857', '#d97706', '#475569'];
            const carColor = carColors[i % carColors.length];
            const carType = i % 3; // 0 = Sedan, 1 = SUV, 2 = Sport

            const carLength = depth * 0.55;
            const carWidth = Math.min(2.1, baySpacing * 0.78);
            const carHeight = carType === 1 ? 1.2 : 0.9;

            return (
              <group key={`car-${i}`} position={[posX, 0.52, 0]} rotation={[0, Math.PI / 2, 0]}>
                {/* Lower Chassis & Body */}
                <mesh castShadow position={[0, 0, 0]}>
                  <boxGeometry args={[carLength, carHeight * 0.6, carWidth]} />
                  <meshStandardMaterial color={carColor} roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Upper Cabin */}
                <mesh castShadow position={[-0.1 * carLength, carHeight * 0.5, 0]}>
                  <boxGeometry args={[carLength * 0.55, carHeight * 0.55, carWidth * 0.9]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Windshield Gloss */}
                <mesh position={[carLength * 0.15, carHeight * 0.52, 0]} rotation={[0, 0, -0.4]}>
                  <planeGeometry args={[0.05, carWidth * 0.85]} />
                  <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.6} transparent />
                </mesh>
                {/* Wheels */}
                {[-carLength * 0.3, carLength * 0.3].map((wX, wIdx) => (
                  <group key={`wheels-${wIdx}`}>
                    <mesh position={[wX, -carHeight * 0.2, carWidth * 0.48]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.26, 0.26, 0.15, 16]} />
                      <meshStandardMaterial color="#0f172a" roughness={0.9} />
                    </mesh>
                    <mesh position={[wX, -carHeight * 0.2, -carWidth * 0.48]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.26, 0.26, 0.15, 16]} />
                      <meshStandardMaterial color="#0f172a" roughness={0.9} />
                    </mesh>
                  </group>
                ))}
                {/* Headlights */}
                <mesh position={[carLength * 0.5 + 0.02, carHeight * 0.1, carWidth * 0.32]}>
                  <boxGeometry args={[0.04, 0.12, 0.24]} />
                  <meshStandardMaterial
                    color="#fef08a"
                    emissive={isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff')}
                    emissiveIntensity={isNight ? 1.5 : 0.3}
                  />
                </mesh>
                <mesh position={[carLength * 0.5 + 0.02, carHeight * 0.1, -carWidth * 0.32]}>
                  <boxGeometry args={[0.04, 0.12, 0.24]} />
                  <meshStandardMaterial
                    color="#fef08a"
                    emissive={isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff')}
                    emissiveIntensity={isNight ? 1.5 : 0.3}
                  />
                </mesh>
                {/* Taillights */}
                <mesh position={[-carLength * 0.5 - 0.02, carHeight * 0.1, carWidth * 0.32]}>
                  <boxGeometry args={[0.04, 0.12, 0.24]} />
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive={isNight || isSunset ? new THREE.Color('#ef4444') : new THREE.Color('#440000')}
                    emissiveIntensity={isNight ? 1.8 : 0.2}
                  />
                </mesh>
                <mesh position={[-carLength * 0.5 - 0.02, carHeight * 0.1, -carWidth * 0.32]}>
                  <boxGeometry args={[0.04, 0.12, 0.24]} />
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive={isNight || isSunset ? new THREE.Color('#ef4444') : new THREE.Color('#440000')}
                    emissiveIntensity={isNight ? 1.8 : 0.2}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Integrated Night Light Bollards for Parking Area */}
          {[-width / 2 + 1, width / 2 - 1].map((pX, pIdx) => (
            <group key={`park-light-${pIdx}`} position={[pX, 0, 0]}>
              <mesh castShadow position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.08, 0.12, 2.4, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, 2.45, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.15, 12]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive={isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff')}
                  emissiveIntensity={isNight ? 2.2 : 0.5}
                />
              </mesh>
              {(isNight || isSunset) && (
                <pointLight
                  position={[0, 2.3, 0]}
                  color="#fef08a"
                  intensity={isNight ? 16 : 6}
                  distance={width * 0.8}
                />
              )}
            </group>
          ))}

          {isSelected && (
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[width + 0.4, 0.12, depth + 0.4]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'waterfall': {
      const cliffHeight = Math.max(6.0, depth * 0.45);
      const basinW = width * 0.85;
      const basinD = depth * 0.55;

      return (
        <group>
          {/* Natural Rock Cliff Formation Base */}
          <group position={[0, cliffHeight / 2, -depth * 0.2]}>
            {/* Main Cliff Wall */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width, cliffHeight, depth * 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.95} metalness={0.1} />
            </mesh>
            {/* Terraced Slate Rock Boulders */}
            {[-width * 0.35, -width * 0.1, width * 0.15, width * 0.38].map((rX, rIdx) => (
              <mesh key={`rock-${rIdx}`} castShadow position={[rX, (rIdx % 2) * 0.8 - cliffHeight * 0.2, 0.6 + (rIdx % 2) * 0.4]}>
                <dodecahedronGeometry args={[1.6 + (rIdx % 3) * 0.4, 1]} />
                <meshStandardMaterial color="#475569" roughness={0.9} />
              </mesh>
            ))}
          </group>

          {/* Lower Splash Water Basin Pond */}
          <group position={[0, 0.15, depth * 0.2]}>
            {/* Pond Stone Rim */}
            <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[basinW + 1.2, 0.3, basinD + 1.2]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
            {/* Pond Water Surface */}
            <mesh receiveShadow position={[0, 0.22, 0]}>
              <boxGeometry args={[basinW, 0.1, basinD]} />
              <meshPhysicalMaterial
                color="#0284c7"
                transmission={0.85}
                opacity={0.88}
                transparent
                roughness={0.08}
                metalness={0.1}
                ior={1.333}
              />
            </mesh>
            {/* Splash Ripple Ring */}
            <mesh position={[0, 0.28, -basinD * 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, basinW * 0.35, 32]} />
              <meshBasicMaterial color="#bae6fd" transparent opacity={0.6} />
            </mesh>
          </group>

          {/* Cascading Flowing Water Stream Sheets */}
          <group position={[0, cliffHeight * 0.45, -depth * 0.05]}>
            <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[width * 0.65, cliffHeight * 0.9, 0.25]} />
              <meshPhysicalMaterial
                color="#7dd3fc"
                emissive="#38bdf8"
                emissiveIntensity={isNight ? 0.3 : 0.1}
                transmission={0.8}
                transparent
                opacity={0.75}
                roughness={0.1}
              />
            </mesh>
            {/* Foam White Spray Layer */}
            <mesh position={[0, -cliffHeight * 0.35, depth * 0.15]}>
              <boxGeometry args={[width * 0.72, 0.4, 0.8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          </group>

          {/* Surrounding Natural Shrubs & Plants */}
          {[-width * 0.42, width * 0.42].map((pX, pIdx) => (
            <group key={`plant-${pIdx}`} position={[pX, 0.4, depth * 0.25]}>
              <mesh castShadow>
                <sphereGeometry args={[1.2, 8, 8]} />
                <meshStandardMaterial color={isNight ? '#064e3b' : '#15803d'} roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* Integrated Night Illumination for Waterfall */}
          {(isNight || isSunset) && (
            <>
              {/* Submerged Blue Basin Light */}
              <pointLight
                position={[0, 0.6, depth * 0.2]}
                color="#38bdf8"
                intensity={isNight ? 24 : 10}
                distance={width * 1.2}
              />
              {/* Rock Uplights */}
              <spotLight
                position={[0, 0.4, depth * 0.1]}
                target-position={[0, cliffHeight * 0.6, -depth * 0.2]}
                color="#bae6fd"
                intensity={isNight ? 35 : 12}
                distance={cliffHeight * 2.5}
                angle={Math.PI / 3}
                penumbra={0.5}
              />
            </>
          )}

          {isSelected && (
            <mesh position={[0, cliffHeight / 2, 0]}>
              <boxGeometry args={[width + 0.6, cliffHeight + 0.4, depth + 0.6]} />
              <primitive object={selectionMaterial} />
            </mesh>
          )}
        </group>
      );
    }

    case 'pool': {
      const waterW = Math.max(4, width - 3.2);
      const waterD = Math.max(3, depth - 3.2);

      return (
        <group>
          {/* Paved Pool Deck Surroundings */}
          <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[width, 0.16, depth]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>

          {/* Raised Pool Coping Rim */}
          <mesh receiveShadow castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[waterW + 0.6, 0.12, waterD + 0.6]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>

          {/* Submerged Pool Floor & Walls */}
          <mesh receiveShadow position={[0, -0.4, 0]}>
            <boxGeometry args={[waterW, 0.8, waterD]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>

          {/* Shallow End Entry Steps */}
          {[-waterW * 0.35, -waterW * 0.2].map((sX, sIdx) => (
            <mesh key={`step-${sIdx}`} receiveShadow position={[sX, 0.02 - sIdx * 0.15, 0]}>
              <boxGeometry args={[1.2, 0.15, waterD - 0.4]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.3} />
            </mesh>
          ))}

          {/* Translucent Water Depth Layer */}
          <mesh receiveShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[waterW, 0.22, waterD]} />
            <meshPhysicalMaterial
              color="#0284c7"
              transmission={0.88}
              opacity={0.85}
              transparent
              roughness={0.06}
              metalness={0.1}
              ior={1.333}
            />
          </mesh>

          {/* Stainless Steel Handrail Ladder */}
          <group position={[waterW / 2 - 0.6, 0.5, 0]}>
            <mesh castShadow position={[0, 0, -0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow position={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Underwater LED Lights */}
          {(isNight || isSunset) && (
            <>
              <pointLight
                position={[-waterW * 0.25, 0.05, 0]}
                color="#38bdf8"
                intensity={isNight ? 26.0 : 10.0}
                distance={Math.max(16, width * 1.6)}
                decay={1.8}
              />
              <pointLight
                position={[waterW * 0.25, 0.05, 0]}
                color="#38bdf8"
                intensity={isNight ? 26.0 : 10.0}
                distance={Math.max(16, width * 1.6)}
                decay={1.8}
              />
            </>
          )}

          {/* Poolside Sun Loungers with Fabric Cushions & Umbrella */}
          {[-width / 3, width / 3].map((x, i) => (
            <group key={`lounger-${i}`} position={[x, 0.25, depth / 2 - 1.2]}>
              <mesh castShadow position={[0, 0.08, 0]}>
                <boxGeometry args={[1.2, 0.12, 1.8]} />
                <meshStandardMaterial color="#78350f" roughness={0.8} />
              </mesh>
              <mesh castShadow position={[0, 0.18, 0]}>
                <boxGeometry args={[1.1, 0.1, 1.7]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
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
          {/* Main Asphalt Road Bed */}
          <mesh receiveShadow position={[0, 0.03, 0]}>
            <boxGeometry args={[width, 0.06, depth]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={isNight || isSunset ? 0.35 : 0.8}
              metalness={isNight || isSunset ? 0.3 : 0.0}
            />
          </mesh>

          {/* Dashed Center Markings */}
          {dashPositions.map((x, i) => (
            <mesh key={`dash-${i}`} position={[x, 0.07, 0]}>
              <boxGeometry args={[dashSpacing * 0.6, 0.01, 0.28]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          ))}

          {/* Integrated Night Cat-Eye Reflectors along Road Edge */}
          {dashPositions.map((x, i) => (
            <group key={`cateye-${i}`}>
              <mesh position={[x, 0.08, depth / 2 - 0.3]}>
                <boxGeometry args={[0.2, 0.03, 0.12]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive={isNight ? new THREE.Color('#fbbf24') : new THREE.Color('#000000')}
                  emissiveIntensity={isNight ? 1.5 : 0}
                />
              </mesh>
              <mesh position={[x, 0.08, -depth / 2 + 0.3]}>
                <boxGeometry args={[0.2, 0.03, 0.12]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive={isNight ? new THREE.Color('#fbbf24') : new THREE.Color('#000000')}
                  emissiveIntensity={isNight ? 1.5 : 0}
                />
              </mesh>
            </group>
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
          {/* Manicured Lawn Grass Base */}
          <mesh receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[width, 0.1, depth]} />
            <meshStandardMaterial
              color={isNight ? '#064e3b' : isSunset ? '#15803d' : '#16a34a'}
              roughness={0.9}
            />
          </mesh>

          {/* Stone Paved Cross Paths */}
          <mesh receiveShadow position={[0, 0.07, 0]}>
            <boxGeometry args={[width, 0.02, 2.4]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          <mesh receiveShadow position={[0, 0.07, 0]}>
            <boxGeometry args={[2.4, 0.02, depth]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>

          {/* Central Fountain Tier Feature */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[Math.min(3, width * 0.2), Math.min(3.3, width * 0.22), 0.6, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[Math.min(2.8, width * 0.18), Math.min(2.8, width * 0.18), 0.1, 16]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent />
          </mesh>

          {/* Garden Bollard Lights at Night */}
          {[-width * 0.35, width * 0.35].map((bX, bIdx) => (
            <group key={`bollard-${bIdx}`} position={[bX, 0, depth * 0.35]}>
              <mesh castShadow position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.08, 0.1, 1.0, 8]} />
                <meshStandardMaterial color="#334155" roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.1, 8]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive={isNight || isSunset ? new THREE.Color('#fef08a') : new THREE.Color('#ffffff')}
                  emissiveIntensity={isNight ? 2.0 : 0.4}
                />
              </mesh>
              {(isNight || isSunset) && (
                <pointLight position={[0, 0.9, 0]} color="#fef08a" intensity={isNight ? 12 : 4} distance={10} />
              )}
            </group>
          ))}

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
          {/* Main Clubhouse Structure */}
          <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
            <boxGeometry args={[width, 5.0, depth]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 5.15, 0]}>
            <boxGeometry args={[width + 1.0, 0.3, depth + 1.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>

          {/* Glass Facade & Window Glow */}
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

          {/* Exterior Wall Sconce Warm Lights for Night */}
          {(isNight || isSunset) && (
            <>
              <pointLight
                position={[-width / 2 + 0.5, 3.5, depth / 2 + 0.4]}
                color="#fef08a"
                intensity={isNight ? 18 : 6}
                distance={15}
              />
              <pointLight
                position={[width / 2 - 0.5, 3.5, depth / 2 + 0.4]}
                color="#fef08a"
                intensity={isNight ? 18 : 6}
                distance={15}
              />
            </>
          )}

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
          {/* Bark Trunk */}
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 3.6, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Foliage Spheres */}
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

          {/* Garden Tree Uplight Spotlight at Night */}
          {(isNight || isSunset) && (
            <spotLight
              position={[0.6, 0.1, 0.6]}
              target-position={[0, 4.0, 0]}
              color="#fbbf24"
              intensity={isNight ? 16 : 5}
              distance={12}
              angle={Math.PI / 4}
            />
          )}

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
