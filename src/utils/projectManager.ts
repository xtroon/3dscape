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
    name: 'Tower Alpha',
    position: [-48, 0, -22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 8, width: 20, depth: 12, wallColor: '#f1f5f9' },
  },
  {
    id: 'b-2',
    name: 'Tower Beta',
    position: [-18, 0, -22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 6, width: 16, depth: 12, wallColor: '#e2e8f0', windowColor: '#0284c7' },
  },
  {
    id: 'b-3',
    name: 'Tower Gamma',
    position: [18, 0, -22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 7, width: 18, depth: 12, wallColor: '#f8fafc' },
  },
  {
    id: 'b-4',
    name: 'Tower Delta',
    position: [48, 0, -22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 9, width: 22, depth: 14, wallColor: '#334155', trimColor: '#f1f5f9' },
  },
  {
    id: 'b-5',
    name: 'Tower Epsilon',
    position: [-48, 0, 22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 5, width: 18, depth: 12, wallColor: '#f1f5f9' },
  },
  {
    id: 'b-6',
    name: 'Tower Zeta',
    position: [-18, 0, 22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 7, width: 20, depth: 12, wallColor: '#e2e8f0', windowColor: '#0284c7' },
  },
  {
    id: 'b-7',
    name: 'Tower Eta',
    position: [18, 0, 22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 6, width: 16, depth: 12, wallColor: '#f8fafc' },
  },
  {
    id: 'b-8',
    name: 'Tower Theta',
    position: [48, 0, 22],
    rotationY: 0,
    config: { ...defaultBuildingConfig, floors: 8, width: 20, depth: 14, wallColor: '#1e293b', trimColor: '#38bdf8' },
  },
];

export const createDefaultInitialElements = (): SiteElement[] => [
  // Central Main Avenue & Branch Roads
  {
    id: 'el-road-main',
    type: 'road',
    name: 'Central Boulevard',
    position: [0, 0, 0],
    rotationY: 0,
    width: 130,
    depth: 10,
  },
  {
    id: 'el-road-north',
    type: 'road',
    name: 'North Access Road',
    position: [0, 0, -30],
    rotationY: Math.PI / 2,
    width: 50,
    depth: 9,
  },
  {
    id: 'el-road-south',
    type: 'road',
    name: 'South Park Avenue',
    position: [0, 0, 30],
    rotationY: Math.PI / 2,
    width: 50,
    depth: 9,
  },

  // Street Lights evenly positioned along Central Boulevard
  {
    id: 'el-lamp-1',
    type: 'street_light',
    name: 'North Street Lamp 1',
    position: [-48, 0, -7],
    rotationY: 0,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-2',
    type: 'street_light',
    name: 'North Street Lamp 2',
    position: [-24, 0, -7],
    rotationY: 0,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-3',
    type: 'street_light',
    name: 'North Street Lamp 3',
    position: [24, 0, -7],
    rotationY: 0,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-4',
    type: 'street_light',
    name: 'North Street Lamp 4',
    position: [48, 0, -7],
    rotationY: 0,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-5',
    type: 'street_light',
    name: 'South Street Lamp 1',
    position: [-48, 0, 7],
    rotationY: Math.PI,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-6',
    type: 'street_light',
    name: 'South Street Lamp 2',
    position: [-24, 0, 7],
    rotationY: Math.PI,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-7',
    type: 'street_light',
    name: 'South Street Lamp 3',
    position: [24, 0, 7],
    rotationY: Math.PI,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },
  {
    id: 'el-lamp-8',
    type: 'street_light',
    name: 'South Street Lamp 4',
    position: [48, 0, 7],
    rotationY: Math.PI,
    width: 6.0,
    lightColor: '#fbbf24',
    lightIntensity: 39,
    headType: 'single',
  },

  // Roadside & Corner Trees
  { id: 'el-tree-1', type: 'tree', name: 'Avenue Tree 1', position: [-60, 0, -7], rotationY: 0 },
  { id: 'el-tree-2', type: 'tree', name: 'Avenue Tree 2', position: [-36, 0, -7], rotationY: 0 },
  { id: 'el-tree-3', type: 'tree', name: 'Avenue Tree 3', position: [-8, 0, -7], rotationY: 0 },
  { id: 'el-tree-4', type: 'tree', name: 'Avenue Tree 4', position: [8, 0, -7], rotationY: 0 },
  { id: 'el-tree-5', type: 'tree', name: 'Avenue Tree 5', position: [36, 0, -7], rotationY: 0 },
  { id: 'el-tree-6', type: 'tree', name: 'Avenue Tree 6', position: [60, 0, -7], rotationY: 0 },
  { id: 'el-tree-7', type: 'tree', name: 'Avenue Tree 7', position: [-60, 0, 7], rotationY: 0 },
  { id: 'el-tree-8', type: 'tree', name: 'Avenue Tree 8', position: [-36, 0, 7], rotationY: 0 },
  { id: 'el-tree-9', type: 'tree', name: 'Avenue Tree 9', position: [36, 0, 7], rotationY: 0 },
  { id: 'el-tree-10', type: 'tree', name: 'Avenue Tree 10', position: [60, 0, 7], rotationY: 0 },

  // Central Community Amenities
  {
    id: 'el-clubhouse-1',
    type: 'clubhouse',
    name: 'Grand Clubhouse',
    position: [0, 0, -48],
    rotationY: 0,
    width: 24,
    depth: 16,
  },
  {
    id: 'el-park-1',
    type: 'park',
    name: 'Central Green Park',
    position: [0, 0, 48],
    rotationY: 0,
    width: 26,
    depth: 22,
  },
  {
    id: 'el-pool-1',
    type: 'pool',
    name: 'Community Swimming Pool',
    position: [-28, 0, 45],
    rotationY: 0,
    width: 18,
    depth: 12,
  },
  {
    id: 'el-parking-1',
    type: 'parking',
    name: 'Resident Parking Lot',
    position: [28, 0, 45],
    rotationY: 0,
    width: 20,
    depth: 16,
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

  renameProject: (id: string, newName: string): void => {
    if (typeof window === 'undefined') return;
    const projects = projectManager.getProjects();
    const p = projects.find((item) => item.id === id);
    if (p) {
      p.name = newName.trim() || p.name;
      p.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    }
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
