import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  BookMarked, 
  FileText, 
  ShieldAlert, 
  PlusCircle,
  Cpu
} from 'lucide-react';

const navItems = [
  {
    to: '/',
    label: 'Overview & Stats',
    icon: LayoutDashboard,
    badge: null
  },
  {
    to: '/research',
    label: 'AI Legal Research (RAG)',
    icon: Bot,
    badge: 'CORE'
  },
  {
    to: '/precedents',
    label: 'Precedent Law Library',
    icon: BookMarked,
    badge: 'Vector DB'
  },
  {
    to: '/clause-analyzer',
    label: 'Contract Clause Analyzer',
    icon: ShieldAlert,
    badge: 'Risk Engine'
  },
  {
    to: '/brief-drafter',
    label: 'Case Brief Drafter',
    icon: FileText,
    badge: null
  },
  {
    to: '/add-precedent',
    label: 'Ingest Precedent',
    icon: PlusCircle,
    badge: 'Embed'
  }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0B132B]/60 backdrop-blur-md flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Commercial Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400/90 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Architecture note in footer */}
      <div className="p-4 border-t border-slate-800/60 m-2 rounded-xl bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>RAG Pipeline Architecture</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Vector Indexing with high-dimensional Cosine Similarity across Commercial Court Precedents.
        </p>
      </div>
    </aside>
  );
}

