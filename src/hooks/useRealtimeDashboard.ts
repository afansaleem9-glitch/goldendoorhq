import { useState, useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface UseRealtimeDashboardOptions {
  table: string;
  orgId: string;
  onRefresh: () => void;
  enabled?: boolean;
}

export function useRealtimeDashboard(options: UseRealtimeDashboardOptions) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleChange = useCallback((eventType: string) => {
    setLastUpdate(new Date());
    if (autoRefresh) {
      options.onRefresh();
    } else {
      setPendingChanges(prev => prev + 1);
    }
  }, [autoRefresh, options.onRefresh]);

  useRealtimeSubscription({
    table: options.table,
    filter: { column: 'organization_id', value: options.orgId },
    onAny: handleChange,
    enabled: options.enabled,
  });

  const applyPendingChanges = useCallback(() => {
    options.onRefresh();
    setPendingChanges(0);
  }, [options.onRefresh]);

  return {
    lastUpdate,
    pendingChanges,
    autoRefresh,
    setAutoRefresh,
    applyPendingChanges,
  };
}
