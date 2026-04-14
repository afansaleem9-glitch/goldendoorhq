'use client';

import { useState, useEffect, useCallback } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { total?: number; page?: number; limit?: number };
  error?: string;
}

interface UseApiOptions {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useApi<T>(endpoint: string, options: UseApiOptions = {}) {
  const { page = 1, limit = 25, search, filters, autoFetch = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    return `${endpoint}?${params.toString()}`;
  }, [endpoint, page, limit, search, filters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl());
      const json: ApiResponse<T[]> = await res.json();
      if (json.success) {
        setData(json.data || []);
        setTotal(json.meta?.total || json.data?.length || 0);
      } else {
        setError(json.error || 'Failed to fetch data');
        setData([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [fetchData, autoFetch]);

  const create = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      await fetchData();
      return json.data;
    }
    throw new Error(json.error || 'Create failed');
  }, [endpoint, fetchData]);

  const update = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      await fetchData();
      return json.data;
    }
    throw new Error(json.error || 'Update failed');
  }, [endpoint, fetchData]);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      await fetchData();
      return json.data;
    }
    throw new Error(json.error || 'Delete failed');
  }, [endpoint, fetchData]);

  return { data, loading, error, total, refetch: fetchData, create, update, remove };
}

export function useSingleApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then(r => r.json())
      .then(json => {
        if (json.success) setData(json.data);
        else setError(json.error);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}
