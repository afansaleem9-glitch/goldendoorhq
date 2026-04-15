'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface UseRealtimeOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onAny?: (payload: any) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onAny,
  enabled = true,
}: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const channelName = filter ? `${table}:${filter}` : table;
    const channel = supabase.channel(channelName);

    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => {
          setIsConnected(true);
          onInsert?.(payload);
          onAny?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => {
          setIsConnected(true);
          onUpdate?.(payload);
          onAny?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => {
          setIsConnected(true);
          onDelete?.(payload);
          onAny?.(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      subscription.unsubscribe();
      setIsConnected(false);
    };
  }, [table, filter, onInsert, onUpdate, onDelete, onAny, enabled]);

  return { channelRef, isConnected };
}
