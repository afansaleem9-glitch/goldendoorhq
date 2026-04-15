"use client";
import { RefreshCw, Command } from 'lucide-react';

interface RealtimeBadgeProps {
  lastUpdate: Date | null;
  pendingChanges: number;
  onApply?: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh?: () => void;
}

export function RealtimeBadge({ lastUpdate, pendingChanges, onApply, autoRefresh, onToggleAutoRefresh }: RealtimeBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-emerald-700">LIVE</span>
      </div>
      {lastUpdate && (
        <span className="text-[10px] text-gray-400">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
      {pendingChanges > 0 && onApply && (
        <button onClick={onApply} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
          <RefreshCw size={10} className="text-blue-600" />
          <span className="text-[10px] font-semibold text-blue-700">{pendingChanges} new</span>
        </button>
      )}
      {onToggleAutoRefresh && (
        <button onClick={onToggleAutoRefresh} className={`text-[10px] font-medium px-2 py-0.5 rounded ${autoRefresh ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}>
          {autoRefresh ? 'Auto' : 'Manual'}
        </button>
      )}
    </div>
  );
}
