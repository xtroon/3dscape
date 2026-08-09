export type CameraPreset = 'master_map' | 'street' | 'street_walk';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export type SiteElementType = 'road' | 'park' | 'parking' | 'tree' | 'pool' | 'clubhouse' | 'street_light';

export interface BuildingConfig {
  floors: number;
  width: number; // Building width X in meters (default 16, min 10, max 40)
  depth: number; // Building depth Z in meters (default 10, min 8, max 30)
  showWindows: boolean;
  showBalconies: boolean;
  showParking: boolean;
  showStreetLights: boolean;
  wallColor: string;
  windowColor: string;
  trimColor: string;
  roofColor: string;
  balconyColor: string;
  timeOfDay: TimeOfDay;
  propertyName: string;
  propertySubtitle: string;
}

export interface SiteBuilding {
  id: string;
  name: string; // e.g., "Building A"
  position: [number, number, number];
  rotationY: number; // in radians
  config: BuildingConfig;
}

export interface SiteElement {
  id: string;
  type: SiteElementType;
  name: string;
  position: [number, number, number];
  rotationY: number;
  width?: number; // Custom measurement width/height in meters
  depth?: number; // Custom measurement depth/length in meters
  lightColor?: string; // Hex light color for street lamps (e.g. #fbbf24)
  lightIntensity?: number; // Light brightness (e.g. 5 to 40)
  headType?: 'single' | 'double' | 'quad'; // Fixture head count
}

export interface SelectedItemRef {
  id: string;
  type: 'building' | 'element';
}

export type PlacementTool = SiteElementType | 'building' | null;

export interface SiteConfig {
  propertyName: string;
  propertySubtitle: string;
  timeOfDay: TimeOfDay;
  showBoundaryWall: boolean;
  showGridLines: boolean;
  gridSnap: boolean;
  snapSize: number; // e.g., 2 meters
  plotSize: [number, number]; // [width, depth]
}

export interface CameraPositionPreset {
  id: CameraPreset;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
