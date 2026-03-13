import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { SendMoneyPage } from './components/pages/SendMoneyPage';
import { ReceivePage } from './components/pages/ReceivePage';
import { WalletsPage } from './components/pages/WalletsPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { CardsPage } from './components/pages/CardsPage';
import { ExchangePage } from './components/pages/ExchangePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { KYCPage } from './components/pages/KYCPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          { index: true, element: <Navigate to="/auth/login" replace /> },
          { path: 'login', Component: LoginPage },
          { path: 'register', Component: RegisterPage },
        ],
      },
      {
        path: 'app',
        Component: DashboardLayout,
        children: [
          { index: true, element: <Navigate to="/app/dashboard" replace /> },
          { path: 'dashboard', Component: DashboardPage },
          { path: 'send', Component: SendMoneyPage },
          { path: 'receive', Component: ReceivePage },
          { path: 'wallets', Component: WalletsPage },
          { path: 'transactions', Component: TransactionsPage },
          { path: 'cards', Component: CardsPage },
          { path: 'exchange', Component: ExchangePage },
          { path: 'kyc', Component: KYCPage },
          { path: 'settings', Component: SettingsPage },
        ],
      },
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
