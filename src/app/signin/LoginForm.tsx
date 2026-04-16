'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const redirect = params.get('redirect') || '/';
  const urlError = params.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === 'unauthorized' ? 'This account is not permitted.' : null
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === 'rate_limited' ? 'Too many attempts. Try again later.' : 'Invalid credentials');
        setIsLoading(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/delta-logo.svg"
            alt="Delta Power Group"
            width={56}
            height={56}
            priority
          />
          <h1 className="text-[18px] font-extrabold text-black tracking-tight mt-4">GoldenDoorHQ</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Delta Power Group, Inc.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/60 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-[12px] px-3 py-2.5 rounded-lg flex items-center gap-2 bg-red-50 border border-red-200 text-red-700">
                <Shield size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@goldendoorhq.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-[13px] focus:border-black outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white bg-black hover:bg-gray-900 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-1">
              <Lock size={12} className="text-gray-400" />
              <p className="text-[11px] text-gray-500">
                Access is by invitation only. Contact your administrator.
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] mt-6 text-gray-400">
          Copyright © 2026 GoldenDoorHQ · All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
