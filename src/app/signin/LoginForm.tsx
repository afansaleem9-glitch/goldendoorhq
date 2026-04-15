'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const redirect = params.get('redirect') || '/';
  const urlError = params.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    urlError === 'unauthorized' ? 'This account is not permitted.' : null
  );
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === 'rate_limited' ? 'Too many attempts. Try again later.' : 'Invalid credentials');
        setSubmitting(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
    >
      <div>
        <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[14px] text-[#0B1F3A] focus:border-[#F0A500] focus:ring-2 focus:ring-[#F0A500]/30 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[14px] text-[#0B1F3A] focus:border-[#F0A500] focus:ring-2 focus:ring-[#F0A500]/30 outline-none"
        />
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#F0A500] hover:bg-yellow-500 disabled:opacity-60 text-[#0B1F3A] font-semibold py-2.5 transition-colors"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
