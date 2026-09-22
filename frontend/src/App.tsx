import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { NewScreening } from './pages/NewScreening';
import { ScreeningResult } from './pages/ScreeningResult';
import { CompareDocuments } from './pages/CompareDocuments';
import { DemoMode } from './pages/DemoMode';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/screen/new" element={<NewScreening />} />
          <Route path="/screening/:id" element={<ScreeningResult />} />
          <Route path="/compare" element={<CompareDocuments />} />
          <Route path="/demo-mode" element={<DemoMode />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
