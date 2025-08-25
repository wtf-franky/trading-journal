import React, { useState } from 'react';
import { Trade } from '../types';
import { formatCurrency } from '../utils/calculations';
import { ChevronLeft, ChevronRight, Plus, Edit3 } from 'lucide-react';

interface CalendarProps {
  trades: Record<string, Trade>;
  onUpdateTrade: (date: string, trade: Trade) => void;
}

export default function Calendar({ trades, onUpdateTrade }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pnlValue, setPnlValue] = useState('');
  const [notes, setNotes] = useState('');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  const calendarDays = [];
  const currentDateObj = new Date(startDate);

  while (currentDateObj <= endDate) {
    calendarDays.push(new Date(currentDateObj));
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    const existingTrade = trades[dateStr];
    setPnlValue(existingTrade ? existingTrade.pnl.toString() : '');
    setNotes(existingTrade ? existingTrade.notes || '' : '');
  };

  const handleSaveTrade = () => {
    if (!selectedDate) return;
    
    const pnl = parseFloat(pnlValue) || 0;
    const trade: Trade = {
      date: selectedDate,
      pnl,
      notes: notes.trim() || undefined,
    };
    
    onUpdateTrade(selectedDate, trade);
    setSelectedDate(null);
    setPnlValue('');
    setNotes('');
  };

  const handleDeleteTrade = () => {
    if (!selectedDate) return;
    
    const updatedTrades = { ...trades };
    delete updatedTrades[selectedDate];
    
    // We need to pass an empty trade to effectively delete it
    onUpdateTrade(selectedDate, { date: selectedDate, pnl: 0, notes: undefined });
    setSelectedDate(null);
    setPnlValue('');
    setNotes('');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const getTradePnl = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return trades[dateStr]?.pnl || 0;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Calendário de Trades</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h3 className="text-xl font-semibold text-white min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-gray-400 font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(date => {
              const pnl = getTradePnl(date);
              const hasTradeData = trades[date.toISOString().split('T')[0]];
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    relative p-3 rounded-lg transition-all duration-200 hover:scale-105 min-h-[60px]
                    ${!isCurrentMonth(date) 
                      ? 'text-gray-600 bg-gray-800/30' 
                      : 'text-white bg-gray-800/50 hover:bg-gray-700/50'
                    }
                    ${isToday(date) ? 'ring-2 ring-blue-500/50' : ''}
                    ${hasTradeData && pnl !== 0 
                      ? pnl > 0 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                      : 'border border-gray-800'
                    }
                  `}
                >
                  <div className="text-sm font-medium">
                    {date.getDate()}
                  </div>
                  {hasTradeData && pnl !== 0 && (
                    <div className={`text-xs mt-1 font-medium ${pnl > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {pnl > 0 ? '+' : ''}{formatCurrency(pnl)}
                    </div>
                  )}
                  {hasTradeData && (
                    <Edit3 className="w-3 h-3 absolute top-1 right-1 text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Registar Trade - {new Date(selectedDate).toLocaleDateString('pt-PT')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  P&L (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pnlValue}
                  onChange={(e) => setPnlValue(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Adicionar notas sobre este trade..."
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-2">
                {trades[selectedDate] && (
                  <button
                    onClick={handleDeleteTrade}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  onClick={handleSaveTrade}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}