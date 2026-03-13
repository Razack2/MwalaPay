import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
  DollarSign,
  Send,
  Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const { user } = useAuth();
  const wallets = user ? walletService.getWallets(user.id) : [];
  const transactions = user ? walletService.getTransactions(user.id, 5) : [];

  const totalBalanceMWK = wallets
    .reduce((sum, wallet) => {
      if (wallet.currency === 'MWK') return sum + wallet.balance;
      const rate = walletService.getExchangeRate(wallet.currency, 'MWK');
      return sum + (wallet.balance * rate);
    }, 0);

  // Mock chart data
  const chartData = [
    { date: 'Jan', balance: 450000 },
    { date: 'Feb', balance: 520000 },
    { date: 'Mar', balance: 480000 },
    { date: 'Apr', balance: 620000 },
    { date: 'May', balance: 590000 },
    { date: 'Jun', balance: totalBalanceMWK },
  ];

  const stats = [
    {
      title: 'Total Balance',
      value: `MWK ${totalBalanceMWK.toLocaleString()}`,
      change: '+12.5%',
      icon: Wallet,
      color: 'bg-blue-500',
    },
    {
      title: 'This Month',
      value: `MWK ${(totalBalanceMWK * 0.15).toLocaleString()}`,
      change: '+8.2%',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Transactions',
      value: transactions.length.toString(),
      change: '+23%',
      icon: ArrowUpRight,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Cards',
      value: '2',
      change: 'All active',
      icon: CreditCard,
      color: 'bg-amber-500',
    },
  ];

  const quickActions = [
    { name: 'Send Money', href: '/app/send', icon: Send, color: 'bg-blue-500' },
    { name: 'Receive', href: '/app/receive', icon: Download, color: 'bg-green-500' },
    { name: 'Cards', href: '/app/cards', icon: CreditCard, color: 'bg-purple-500' },
    { name: 'Exchange', href: '/app/exchange', icon: DollarSign, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.fullName.split(' ')[0]}!</h2>
        <p className="text-gray-600">Here's what's happening with your money today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.name} to={action.href}>
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center space-y-2">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link to="/app/transactions">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Start by sending or receiving money</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'send' ? 'bg-red-100' :
                        transaction.type === 'receive' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {transaction.type === 'send' ? (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        ) : transaction.type === 'receive' ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'send' ? '-' : '+'}{transaction.currency} {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Wallets Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Wallets</CardTitle>
            <Link to="/app/wallets">
              <Button variant="ghost" size="sm">Manage</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">{wallet.currency} Wallet</p>
                <p className="text-2xl font-bold mb-2">{wallet.balance.toLocaleString()}</p>
                <p className="text-xs opacity-75">{wallet.accountNumber}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
