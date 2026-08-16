import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  ArrowRight,
  Search,
  FolderOpen,
} from 'lucide-react';
import { projectManager, ProjectData } from '../../utils/projectManager';

interface LandingPageProps {
  onOpenProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenProject,
  onCreateNewProject,
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjectsList = () => {
    setProjects(projectManager.getProjects());
  };

  useEffect(() => {
    loadProjectsList();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      projectManager.deleteProject(id);
      loadProjectsList();
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    projectManager.duplicateProject(id);
    loadProjectsList();
  };

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              BV
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              BuildView
            </span>
            <span className="text-xs font-mono text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a href="#projects" className="hover:text-zinc-900 transition-colors">
              Projects ({projects.length})
            </a>
            <a href="#overview" className="hover:text-zinc-900 transition-colors">
              Overview
            </a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">
              Features
            </a>
          </nav>

          <button
            onClick={onCreateNewProject}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto text-left space-y-6">
          <div className="inline-block font-mono text-xs text-zinc-500 tracking-wider uppercase">
            // Real Estate Architectural Planning
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
            3D site planner for real estate layout and architectural visualization.
          </h1>

          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Create, view, and organize building layouts directly in your browser. Simple, direct, and completely saved on your local machine.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateNewProject}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white font-medium text-sm px-5 py-2.5 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </button>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium text-sm px-5 py-2.5 rounded transition-colors"
            >
              <FolderOpen className="h-4 w-4 text-zinc-500" />
              <span>Saved Projects ({projects.length})</span>
            </a>
          </div>

          {/* Direct Metric Grid */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
              <div className="font-mono text-xs text-zinc-500">STORAGE</div>
              <div className="font-semibold text-sm text-zinc-900 mt-1">100% Local Browser</div>
            </div>
            <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
              <div className="font-mono text-xs text-zinc-500">CAMERA</div>
              <div className="font-semibold text-sm text-zinc-900 mt-1">360° First Person</div>
            </div>
            <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
              <div className="font-mono text-xs text-zinc-500">LIGHTING</div>
              <div className="font-semibold text-sm text-zinc-900 mt-1">Day, Sunset & Night</div>
            </div>
            <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
              <div className="font-mono text-xs text-zinc-500">PERFORMANCE</div>
              <div className="font-semibold text-sm text-zinc-900 mt-1">Zero Server Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Dashboard Section */}
      <section id="projects" className="py-12 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              Projects <span className="font-mono text-xs bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded">{projects.length}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select an existing project or start a new 3D site layout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 w-48 font-sans text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <button
              onClick={onCreateNewProject}
              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded transition-colors whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Create New Card */}
          <div
            onClick={onCreateNewProject}
            className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[190px] bg-zinc-50/50 hover:bg-zinc-100/50 group"
          >
            <div className="h-10 w-10 rounded border border-zinc-300 bg-white flex items-center justify-center text-zinc-700 group-hover:border-zinc-400 mb-3">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-zinc-900">Create New Project</span>
            <span className="text-xs text-zinc-500 mt-1">Start with default site configuration</span>
          </div>

          {/* User Projects */}
          {filteredProjects.map((proj) => {
            const buildingCount = proj.buildings?.length || 0;
            const featureCount = proj.elements?.length || 0;
            const updatedTimeStr = new Date(proj.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="minimal-card rounded-lg p-5 flex flex-col justify-between cursor-pointer transition-all min-h-[190px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-zinc-900 line-clamp-1 hover:text-black">
                      {proj.name}
                    </h3>
                    <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap">
                      {updatedTimeStr}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-zinc-500 mt-1">
                    {buildingCount} {buildingCount === 1 ? 'building' : 'buildings'} · {featureCount} {featureCount === 1 ? 'element' : 'elements'}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:underline">
                    Open studio <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicate(proj.id, e)}
                      title="Duplicate project"
                      className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(proj.id, e)}
                      title="Delete project"
                      className="p-1.5 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Overview & Features Section */}
      <section id="overview" className="py-16 px-6 border-t border-zinc-100 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Features & Specifications
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Direct tools for master plan layout and client presentations.
            </p>
          </div>

          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="font-mono text-xs text-zinc-400">01</div>
              <h3 className="text-sm font-semibold text-zinc-900">Local Browser Engine</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Project data is stored locally in your browser storage. Fast response, complete privacy, no server dependency.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-zinc-400">02</div>
              <h3 className="text-sm font-semibold text-zinc-900">360° Street Level View</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Experience your master plan at pedestrian height with keyboard navigation and instant camera perspective switching.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-zinc-400">03</div>
              <h3 className="text-sm font-semibold text-zinc-900">Procedural Building Parameters</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Adjust floor counts, building dimensions, color palettes, balconies, windows, and solar roof elements in real time.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-zinc-400">04</div>
              <h3 className="text-sm font-semibold text-zinc-900">Lighting & Site Amenities</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Simulate daylight, sunset, and night lighting alongside roads, parks, swimming pools, and street lamp models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 px-6 border-t border-zinc-200 text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>BuildView — Minimal 3D Site Planner</div>
          <div>{new Date().getFullYear()} · Browser Local Storage</div>
        </div>
      </footer>
    </div>
  );
};
