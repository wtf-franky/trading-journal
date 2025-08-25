import React from 'react';
import { UserSettings, Trade } from '../types';
import { 
  calculateDailyChange, 
  calculateWinRate, 
  calculateTotalPnl, 
  formatCurrency, 
  formatPercentage 
} from '../utils/calculations';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

interface DashboardProps {
  settings: UserSettings;
  trades: Record<string, Trade>;
}

export default function Dashboard({ settings, trades }: DashboardProps) {
  const dailyChange = calculateDailyChange(trades);
  const winRate = calculateWinRate(trades);
  const totalPnl = calculateTotalPnl(trades);
  const currentBalance = settings.initialBalance + totalPnl;

  const previousBalance = currentBalance - dailyChange;
  const dailyChangePercentage = previousBalance > 0 
    ? (dailyChange / previousBalance) * 100 
    : 0;

  const stats = [
    {
      title: 'Valor da Conta',
      value: formatCurrency(currentBalance),
      change: '',
      changeValue: '',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Taxa de Acertos',
      value: `${winRate.toFixed(1)}%`,
      change: `${Object.keys(trades).length} dias`,
      changeValue: '',
      icon: Target,
      positive: winRate >= 50,
    },
    {
      title: 'PNL Total',
      value: formatCurrency(totalPnl),
      change: formatPercentage((totalPnl / settings.initialBalance) * 100),
      changeValue: '',
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
      positive: totalPnl >= 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Bem-vindo, {settings.name || 'Trader'}
        </h2>
        <p className="text-gray-400">
          Aqui está o resumo da sua performance de trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map(({ title, value, change, changeValue, icon: Icon, positive }) => (
          <div 
            key={title}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${positive ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                <Icon className={`w-6 h-6 ${positive ? 'text-blue-400' : 'text-red-400'}`} />
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">{title}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{value}</p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${positive ? 'text-blue-400' : 'text-red-400'}`}>
                  {change}
                </span>
                {changeValue && (
                  <span className={`text-sm ${positive ? 'text-blue-400' : 'text-red-400'}`}>
                    {changeValue}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo da Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Capital Inicial:</span>
              <span className="text-white font-medium">{formatCurrency(settings.initialBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Capital Atual:</span>
              <span className={`font-medium ${currentBalance >= settings.initialBalance ? 'text-blue-400' : 'text-red-400'}`}>
                {formatCurrency(currentBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Retorno Total:</span>
              <span className={`font-medium ${totalPnl >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatPercentage((totalPnl / settings.initialBalance) * 100)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas de Trading</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total de Dias em Trading:</span>
              <span className="text-white font-medium">{Object.keys(trades).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dias Positivos:</span>
              <span className="text-blue-400 font-medium">
                {Object.values(trades).filter(t => t.pnl > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dias Negativos:</span>
              <span className="text-red-400 font-medium">
                {Object.values(trades).filter(t => t.pnl < 0).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}