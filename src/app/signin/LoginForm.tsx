'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

const animStyles = `
@keyframes fadeScaleIn { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }
@keyframes pulseGlow { 0%,100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 0.6; transform: scale(1.15); } }
@keyframes conicSpin { 0%,100% { opacity: 0; transform: rotate(0deg); } 50% { opacity: 0.25; transform: rotate(8deg); } }
@keyframes heroBreath { 0%,100% { opacity: 0.85; transform: scale(1); filter: brightness(1.5) saturate(1.4) drop-shadow(0 0 40px rgba(212,175,55,0.5)); } 50% { opacity: 1; transform: scale(1.03); filter: brightness(2.0) saturate(1.7) drop-shadow(0 0 80px rgba(212,175,55,0.8)); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes goldShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
`;

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
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-y-auto py-8"
      style={{ backgroundColor: '#000000' }}
    >
      <style>{animStyles}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, #B8860B 40%, transparent 70%)' }}
        />
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #FFD700, transparent 60%)' }}
        />
      </div>

      <div
        className="relative z-10 flex justify-center mb-6"
        style={{ animation: 'fadeScaleIn 1.8s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ animation: 'pulseGlow 3.5s ease-in-out infinite' }}
        >
          <div
            className="w-[480px] h-[480px] sm:w-[600px] sm:h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.1) 45%, transparent 75%)' }}
          />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ animation: 'conicSpin 6s ease-in-out infinite' }}
        >
          <div
            className="w-[520px] h-[520px] sm:w-[640px] sm:h-[640px]"
            style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(212,175,55,0.18) 25%, transparent 50%, rgba(212,175,55,0.12) 75%, transparent 100%)' }}
          />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/goldendoor-hero.png"
          alt="Golden Door"
          fetchPriority="high"
          className="w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] object-contain"
          style={{ animation: 'heroBreath 4s ease-in-out infinite' }}
        />
      </div>

      <div
        className="relative z-10 w-full max-w-sm px-6"
        style={{ animation: 'slideUp 0.7s ease both 0.5s' }}
      >
        <div className="flex flex-col items-center mb-6">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{
              background: 'linear-gradient(90deg, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'goldShimmer 3s linear infinite',
              textShadow: 'none',
            }}
          >
            GoldenDoorHQ
          </p>
          <p className="text-white/80 text-sm font-medium mt-2">CRM Platform</p>
          <p className="text-white/40 text-[11px] mt-0.5">Delta Power Group, Inc.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="text-[12px] px-3 py-2.5 rounded-lg flex items-center gap-2"
              style={{
                color: '#FCA5A5',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <Shield size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label
              className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@goldendoorhq.com"
              className="w-full h-11 rounded-md px-4 text-[13px] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFF8DC',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label
              className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full h-11 rounded-md px-4 pr-11 text-[13px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFF8DC',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFF8DC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-md text-[13px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
              color: '#1a1208',
              boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.boxShadow = '0 6px 28px rgba(212,175,55,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.25)';
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{
                    border: '2px solid rgba(26,18,8,0.3)',
                    borderTopColor: '#1a1208',
                  }}
                />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Lock size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Access is by invitation only. Contact your administrator.
            </p>
          </div>
        </form>

        <p className="text-center text-[8px] mt-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Copyright © 2026 GoldenDoorHQ
          <br />
          All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
