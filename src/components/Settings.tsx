import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { User, DollarSign, Save } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export default function Settings({ settings, onUpdateSettings }: SettingsProps) {
  const [name, setName] = useState(settings.name);
  const [initialBalance, setInitialBalance] = useState(settings.initialBalance.toString());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(settings.name);
    setInitialBalance(settings.initialBalance.toString());
  }, [settings]);

  const handleSave = () => {
    const updatedSettings: UserSettings = {
      ...settings,
      name: name.trim(),
      initialBalance: parseFloat(initialBalance) || 0,
    };
    
    onUpdateSettings(updatedSettings);
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isValid = name.trim().length > 0 && parseFloat(initialBalance) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Definições</h2>
          <p className="text-gray-400">
            Configure a sua conta e preferências de trading
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-3">
                <User className="w-4 h-4" />
                <span>Nome do Utilizador</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="O seu nome"
                maxLength={50}
              />
              <p className="text-gray-500 text-xs mt-1">
                Este nome será exibido no dashboard
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-3">
                <DollarSign className="w-4 h-4" />
                <span>Capital Inicial (€)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="1000.00"
              />
              <p className="text-gray-500 text-xs mt-1">
                O valor inicial da sua conta de trading
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className={`
                  flex items-center justify-center space-x-2 w-full py-3 rounded-lg font-medium transition-all duration-200
                  ${isValid 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }
                  ${isSaved ? 'bg-green-600 hover:bg-green-600' : ''}
                `}
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? 'Guardado!' : 'Guardar Alterações'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-900/30 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Informações da Conta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Capital Inicial:</span>
              <span className="text-white font-medium">€{parseFloat(initialBalance || '0').toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Moeda Base:</span>
              <span className="text-white font-medium">EUR (€)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fuso Horário:</span>
              <span className="text-white font-medium">Lisboa (UTC+1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Formato Data:</span>
              <span className="text-white font-medium">DD/MM/AAAA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}