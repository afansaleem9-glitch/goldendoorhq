'use client';
import { usePathname } from 'next/navigation';

const HIDE_ON = ['/signin', '/login'];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hide = HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (hide) return null;
  return <>{children}</>;
}
