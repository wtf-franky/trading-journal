import { Trade } from '../types';

export function calculateDailyChange(trades: Record<string, Trade>): number {
  const today = new Date().toISOString().split('T')[0];
  
  const todayTrade = trades[today];
  
  if (!todayTrade) return 0;
  
  return todayTrade.pnl;
}

export function calculateWinRate(trades: Record<string, Trade>): number {
  const tradesList = Object.values(trades);
  if (tradesList.length === 0) return 0;
  
  const wins = tradesList.filter(trade => trade.pnl > 0).length;
  return (wins / tradesList.length) * 100;
}

export function calculateTotalPnl(trades: Record<string, Trade>): number {
  return Object.values(trades).reduce((total, trade) => total + trade.pnl, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}