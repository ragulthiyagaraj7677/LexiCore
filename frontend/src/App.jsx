import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import LegalResearchRAG from './pages/LegalResearchRAG';
import PrecedentLibrary from './pages/PrecedentLibrary';
import ClauseRiskAnalyzer from './pages/ClauseRiskAnalyzer';
import LegalBriefDrafter from './pages/LegalBriefDrafter';
import AddPrecedent from './pages/AddPrecedent';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080D1A] flex flex-col font-sans text-slate-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0 bg-[#080D1A]/95 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/research" element={<LegalResearchRAG />} />
              <Route path="/precedents" element={<PrecedentLibrary />} />
              <Route path="/clause-analyzer" element={<ClauseRiskAnalyzer />} />
              <Route path="/brief-drafter" element={<LegalBriefDrafter />} />
              <Route path="/add-precedent" element={<AddPrecedent />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

