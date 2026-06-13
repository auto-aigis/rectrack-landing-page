import { AuthProvider } from '../_components/AuthProvider';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
