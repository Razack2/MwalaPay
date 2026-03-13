import { Outlet } from 'react-router';
import { AuthProvider } from '../../contexts/AuthContext';
import { Toaster } from '../ui/sonner';

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  );
}
