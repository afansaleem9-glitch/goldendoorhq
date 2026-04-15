import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#1a3a5c] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GoldenDoor</h1>
          <p className="text-[#F0A500] text-lg font-medium">CRM Platform</p>
          <p className="text-gray-400 text-sm mt-1">Delta Power Group, Inc.</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
