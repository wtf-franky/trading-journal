import React, { useState, useEffect } from 'react';
import { ViewType, AppData, Trade, UserSettings } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Settings from './components/Settings';

const initialData: AppData = {
  trades: {},
  settings: {
    name: '',
    initialBalance: 1000,
    currentBalance: 1000,
  }
};

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [appData, setAppData] = useLocalStorage<AppData>('trading-journal-data', initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateTrade = (date: string, trade: Trade) => {
    setAppData(prev => ({
      ...prev,
      trades: trade.pnl === 0 && !trade.notes
        ? Object.fromEntries(Object.entries(prev.trades).filter(([key]) => key !== date))
        : {
            ...prev.trades,
            [date]: trade,
          }
    }));
  };

  const handleUpdateSettings = (settings: UserSettings) => {
    setAppData(prev => ({
      ...prev,
      settings,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando Trading Journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="animate-in fade-in duration-300">
        {currentView === 'dashboard' && (
          <Dashboard 
            settings={appData.settings} 
            trades={appData.trades} 
          />
        )}
        
        {currentView === 'calendar' && (
          <Calendar 
            trades={appData.trades} 
            onUpdateTrade={handleUpdateTrade} 
          />
        )}
        
        {currentView === 'settings' && (
          <Settings 
            settings={appData.settings} 
            onUpdateSettings={handleUpdateSettings} 
          />
        )}
      </main>
    </div>
  );
}

export default App;