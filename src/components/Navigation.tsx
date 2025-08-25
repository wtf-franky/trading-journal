import React from 'react';
import { ViewType } from '../types';
import { BarChart3, Calendar, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, icon: BarChart3, label: 'Dashboard' },
    { id: 'calendar' as ViewType, icon: Calendar, label: 'Calendário' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Definições' },
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Trading Journal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}