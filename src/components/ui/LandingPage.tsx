import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Play,
  Copy,
  Trash2,
  Sparkles,
  Layers,
  Eye,
  Sun,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
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

  const loadProjectsList = () => {
    setProjects(projectManager.getProjects());
  };

  useEffect(() => {
    loadProjectsList();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* Handcrafted Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  BuildView <span className="text-emerald-400">3D</span>
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 hidden sm:block">
                Handcrafted 3D Real Estate & Site Planning Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#projects"
              className="text-xs font-bold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              My Projects ({projects.length})
            </a>
            <button
              onClick={onCreateNewProject}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 shadow-xl shadow-emerald-600/30 transition-all border border-emerald-400/30"
            >
              <Plus className="h-4 w-4" />
              <span>Launch Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-emerald-500/30 px-4 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-extrabold tracking-wider uppercase text-emerald-300">
              Handcrafted 3D Site Architecture Engine
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Visualize Real Estate Projects <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Before You Build.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Design interactive 3D master plans, simulate day-to-night lighting, explore 360° Street View, and customize every building with zero lag and 100% local privacy.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onCreateNewProject}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold text-sm px-6 py-3.5 shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Project</span>
            </button>

            <a
              href="#projects"
              className="flex items-center gap-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm px-6 py-3.5 border border-slate-700/80 backdrop-blur-md transition-all active:scale-95"
            >
              <FolderOpen className="h-4 w-4 text-emerald-400" />
              <span>Explore My Saved Projects ({projects.length})</span>
            </a>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-emerald-400 font-black text-xl sm:text-2xl">60 FPS</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Smooth 3D Engine</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-cyan-400 font-black text-xl sm:text-2xl">360°</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Street Level View</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-amber-400 font-black text-xl sm:text-2xl">Day & Night</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Lighting Simulator</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-emerald-400 font-black text-xl sm:text-2xl">100% Local</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Zero-Lag Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Dashboard Section */}
      <section id="projects" className="py-16 px-6 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-emerald-400" /> My Saved Projects
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                All your 3D property projects are auto-saved to your browser's local storage.
              </p>
            </div>

            <button
              onClick={onCreateNewProject}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Project Card */}
            <div
              onClick={onCreateNewProject}
              className="group relative rounded-3xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-900/30 hover:bg-slate-900/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px]"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all group-hover:scale-110 mb-3 border border-emerald-500/20">
                <Plus className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Start New 3D Project
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Launches a clean 3-4 building setup ready for custom design and expansion.
              </p>
            </div>

            {/* User Saved Projects */}
            {projects.map((proj) => {
              const buildingCount = proj.buildings?.length || 0;
              const featureCount = proj.elements?.length || 0;
              const updatedTimeStr = new Date(proj.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj.id)}
                  className="group relative rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 min-h-[220px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-sm border border-slate-700">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {proj.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{updatedTimeStr}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-4">
                      <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800 text-center">
                        <div className="text-xs font-bold text-slate-200">{buildingCount} Buildings</div>
                        <div className="text-[10px] text-slate-400">Multi-Story Structures</div>
                      </div>
                      <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800 text-center">
                        <div className="text-xs font-bold text-slate-200">{featureCount} Features</div>
                        <div className="text-[10px] text-slate-400">Roads, Parks & Amenities</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Open 3D Planner <ArrowRight className="h-3.5 w-3.5" />
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(proj.id, e)}
                        title="Duplicate project"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        title="Delete project"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Engineered for Modern Site Architects
          </h2>
          <p className="text-sm font-semibold text-slate-400">
            Everything you need to conceptualize, modify, and present master property plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">360° Street View</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step inside your master plan at eye height with WASD and Arrow key controls to experience first-person perspective walk-throughs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Procedural Building Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customize floor counts, wall colors, window glass tints, balconies, solar roofs, and building footprints in real-time.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Sun className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Day & Night Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate sunlight transitions, sunsets, and night lighting with synchronized street lamps, garden bollards, and building window glows.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Lag Local Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% browser-based local storage ensures instant project loading, private client data, and smooth 60 FPS performance without server latency.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-900 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span>BuildView 3D Site Planner & Architectural Studio</span>
          </div>
          <div>© {new Date().getFullYear()} Handcrafted 3D Real Estate Planner</div>
        </div>
      </footer>
    </div>
  );
};
