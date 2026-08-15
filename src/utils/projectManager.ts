import { SiteBuilding, SiteElement, SiteConfig, BuildingConfig } from '../types/building';

export interface ProjectData {
  id: string;
  name: string;
  updatedAt: number;
  buildings: SiteBuilding[];
  elements: SiteElement[];
  siteConfig: SiteConfig;
}

const STORAGE_KEY_PROJECTS = 'buildview_projects_v1';
const STORAGE_KEY_ACTIVE_ID = 'buildview_active_project_id_v1';

const defaultBuildingConfig: BuildingConfig = {
  floors: 6,
  width: 16,
  depth: 10,
  showWindows: true,
  showBalconies: true,
  showParking: true,
  showStreetLights: true,
  wallColor: '#f1f5f9',
  windowColor: '#38bdf8',
  trimColor: '#1e293b',
  roofColor: '#334155',
  balconyColor: '#38bdf8',
  timeOfDay: 'day',
  propertyName: 'Green Horizon Estate',
  propertySubtitle: 'Master Residential Community',
};

export const createDefaultInitialBuildings = (): SiteBuilding[] => [
  {
    id: 'b-1',
    name: 'Building A',
    position: [-25, 0, -20],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 8, width: 20, depth: 12, wallColor: '#f1f5f9' },
  },
  {
    id: 'b-2',
    name: 'Building B',
    position: [25, 0, -20],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 5, width: 16, depth: 10, wallColor: '#e2e8f0', windowColor: '#0284c7' },
  },
  {
    id: 'b-3',
    name: 'Building C',
    position: [-25, 0, 25],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 6, width: 24, depth: 14, wallColor: '#334155', trimColor: '#e2e8f0' },
  },
  {
    id: 'b-4',
    name: 'Building D',
    position: [25, 0, 25],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 5, width: 18, depth: 10, wallColor: '#f8fafc' },
  },
];

export const createDefaultInitialElements = (): SiteElement[] => [
  {
    id: 'el-road-1',
    type: 'road',
    name: 'Main Entrance Avenue',
    position: [0, 0, 0],
    rotationY: 0,
    width: 60,
    depth: 8,
  },
  {
    id: 'el-park-1',
    type: 'park',
    name: 'Central Green Park',
    position: [0, 0, 32],
    rotationY: 0,
    width: 24,
    depth: 24,
  },
  {
    id: 'el-pool-1',
    type: 'pool',
    name: 'Community Swimming Pool',
    position: [-25, 0, 55],
    rotationY: 0,
    width: 18,
    depth: 12,
  },
  {
    id: 'el-parking-1',
    type: 'parking',
    name: 'Resident Parking Lot',
    position: [25, 0, 32],
    rotationY: 0,
    width: 24,
    depth: 16,
  },
  {
    id: 'el-clubhouse-1',
    type: 'clubhouse',
    name: 'Grand Clubhouse',
    position: [0, 0, -50],
    rotationY: 0,
    width: 18,
    depth: 12,
  },
  {
    id: 'el-lamp-1',
    type: 'street_light',
    name: 'Street Lamp 1',
    position: [-10, 0, 8],
    rotationY: 0,
    width: 5.5,
    lightColor: '#fbbf24',
    lightIntensity: 18,
    headType: 'single',
  },
  {
    id: 'el-lamp-2',
    type: 'street_light',
    name: 'Street Lamp 2',
    position: [10, 0, 8],
    rotationY: 0,
    width: 6.5,
    lightColor: '#38bdf8',
    lightIntensity: 24,
    headType: 'double',
  },
];

export const createDefaultSiteConfig = (): SiteConfig => ({
  propertyName: 'Green Horizon Estate',
  propertySubtitle: 'Master Residential Community',
  timeOfDay: 'day',
  showBoundaryWall: true,
  showGridLines: false,
  gridSnap: true,
  snapSize: 2,
  plotSize: [200, 200],
});

export const projectManager = {
  getProjects: (): ProjectData[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse projects from localStorage:', e);
      return [];
    }
  },

  getProject: (id: string): ProjectData | null => {
    const projects = projectManager.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  getActiveProjectId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  },

  setActiveProjectId: (id: string | null): void => {
    if (typeof window === 'undefined') return;
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  },

  createProject: (customName?: string): ProjectData => {
    const projects = projectManager.getProjects();
    const newId = `proj-${Date.now()}`;
    const name = customName || `Site Project ${projects.length + 1}`;
    const newProject: ProjectData = {
      id: newId,
      name,
      updatedAt: Date.now(),
      buildings: createDefaultInitialBuildings(),
      elements: createDefaultInitialElements(),
      siteConfig: createDefaultSiteConfig(),
    };

    projects.unshift(newProject);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, newId);
    }
    return newProject;
  },

  saveProject: (projectData: ProjectData): void => {
    if (typeof window === 'undefined') return;
    const projects = projectManager.getProjects();
    const idx = projects.findIndex((p) => p.id === projectData.id);
    const updated = { ...projectData, updatedAt: Date.now() };

    if (idx >= 0) {
      projects[idx] = updated;
    } else {
      projects.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, projectData.id);
  },

  deleteProject: (id: string): void => {
    if (typeof window === 'undefined') return;
    let projects = projectManager.getProjects();
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));

    const activeId = projectManager.getActiveProjectId();
    if (activeId === id) {
      projectManager.setActiveProjectId(projects[0]?.id || null);
    }
  },

  duplicateProject: (id: string): ProjectData | null => {
    const target = projectManager.getProject(id);
    if (!target) return null;

    const newId = `proj-${Date.now()}`;
    const clone: ProjectData = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      updatedAt: Date.now(),
    };

    const projects = projectManager.getProjects();
    projects.unshift(clone);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    }
    return clone;
  },
};
