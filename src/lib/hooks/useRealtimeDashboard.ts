'use client';

import { useCallback, useState } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export interface UseRealtimeDashboardOptions {
  tables: string[];
  enabled?: boolean;
}

export function useRealtimeDashboard({
  tables,
  enabled = true,
}: UseRealtimeDashboardOptions) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleChange = useCallback(() => {
    setLastUpdate(new Date());
    setPendingChanges((prev) => prev + 1);
  }, []);

  const resetPendingChanges = useCallback(() => {
    setPendingChanges(0);
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev);
  }, []);

  // Subscribe to all tables
  const subscriptions = tables.map((table) =>
    useRealtimeSubscription({
      table,
      onAny: handleChange,
      enabled,
    })
  );

  const isConnected = subscriptions.some((sub) => sub.isConnected);

  return {
    lastUpdate,
    pendingChanges,
    autoRefresh,
    isConnected,
    resetPendingChanges,
    toggleAutoRefresh,
  };
}
