import React, { useState } from 'react';
import {
  Building2,
  Trees,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

import {
  SiteBuilding,
  SiteElement,
  SelectedItemRef,
} from '../../types/building';

interface SiteObjectListProps {
  buildings: SiteBuilding[];
  elements: SiteElement[];
  selectedItem: SelectedItemRef | null;
  onSelectItem: (item: SelectedItemRef | null) => void;
  onDuplicateItem: (id: string, type: 'building' | 'element') => void;
  onDeleteItem: (id: string, type: 'building' | 'element') => void;
}

export const SiteObjectList: React.FC<SiteObjectListProps> = ({
  buildings,
  elements,
  selectedItem,
  onSelectItem,
  onDuplicateItem,
  onDeleteItem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <div
      className={`absolute top-20 right-4 z-20 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[105%]' : 'translate-x-0'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-9 top-4 flex h-9 w-9 items-center justify-center rounded-l-xl glass-panel text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl border-r-0"
        title={isCollapsed ? 'Expand Site Inventory' : 'Collapse Site Inventory'}
      >
        {isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Outliner Container */}
      <div className="glass-panel w-64 max-h-[70vh] overflow-y-auto rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5 text-slate-100 border border-slate-700/60">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <ListFilter className="h-3.5 w-3.5 text-emerald-400" />
            <span>Site Inventory</span>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            {buildings.length + elements.length} Items
          </span>
        </div>

        {/* Buildings Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Buildings ({buildings.length})
          </span>
          {buildings.map((b) => {
            const isSelected = selectedItem?.id === b.id && selectedItem?.type === 'building';
            return (
              <div
                key={`item-b-${b.id}`}
                onClick={() => onSelectItem({ id: b.id, type: 'building' })}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-600/90 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">{b.name}</span>
                  <span className="text-[10px] opacity-75">({b.config.floors}F)</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateItem(b.id, 'building');
                    }}
                    title="Duplicate"
                    className="p-1 hover:text-emerald-300 transition-all"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  {buildings.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(b.id, 'building');
                      }}
                      title="Delete"
                      className="p-1 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Site Elements Section */}
        {elements.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Site Features ({elements.length})
            </span>
            {elements.map((el) => {
              const isSelected = selectedItem?.id === el.id && selectedItem?.type === 'element';
              return (
                <div
                  key={`item-el-${el.id}`}
                  onClick={() => onSelectItem({ id: el.id, type: 'element' })}
                  className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-600/90 text-white shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Trees className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="truncate">{el.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateItem(el.id, 'element');
                      }}
                      title="Duplicate"
                      className="p-1 hover:text-emerald-300 transition-all"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(el.id, 'element');
                      }}
                      title="Delete"
                      className="p-1 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
