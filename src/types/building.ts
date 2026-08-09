export type CameraPreset = 'street' | 'front' | 'side' | 'elevated';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface BuildingConfig {
  floors: number;
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

export interface CameraPositionPreset {
  id: CameraPreset;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
