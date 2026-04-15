import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  table: string;
  filter?: { column: string; value: string };
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onAny?: (eventType: string, payload: any) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription(options: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (options.enabled === false) return;

    const channelName = `realtime-${options.table}-${options.filter?.value || 'all'}-${Date.now()}`;
    let channel = supabase.channel(channelName);

    const filterStr = options.filter
      ? `${options.filter.column}=eq.${options.filter.value}`
      : undefined;

    channel = channel.on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: options.table,
        ...(filterStr ? { filter: filterStr } : {})
      },
      (payload: any) => {
        const eventType = payload.eventType;
        if (eventType === 'INSERT' && options.onInsert) options.onInsert(payload.new);
        if (eventType === 'UPDATE' && options.onUpdate) options.onUpdate(payload.new);
        if (eventType === 'DELETE' && options.onDelete) options.onDelete(payload.old);
        if (options.onAny) options.onAny(eventType, payload);
      }
    );

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [options.table, options.filter?.value, options.enabled]);

  return channelRef;
}
