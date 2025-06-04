import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container min-h-screen bg-[var(--background)]">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;