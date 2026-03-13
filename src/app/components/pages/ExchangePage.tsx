import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function ExchangePage() {
  const { user } = useAuth();
  const [wallets] = useState(user ? walletService.getWallets(user.id) : []);
  const [fromCurrency, setFromCurrency] = useState('MWK');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const exchangeRate = walletService.getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount ? parseFloat(amount) * exchangeRate : 0;
  const fromWallet = wallets.find(w => w.currency === fromCurrency);

  const handleExchange = async () => {
    if (!user || !amount) return;

    setLoading(true);

    const success = walletService.exchangeCurrency(
      user.id,
      fromCurrency,
      toCurrency,
      parseFloat(amount)
    );

    if (success) {
      toast.success(`Exchanged ${fromCurrency} ${amount} to ${toCurrency} ${convertedAmount.toFixed(2)}`);
      setAmount('');
    } else {
      toast.error('Insufficient balance');
    }

    setLoading(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const popularPairs = [
    { from: 'MWK', to: 'USD', label: 'MWK → USD' },
    { from: 'USD', to: 'MWK', label: 'USD → MWK' },
    { from: 'MWK', to: 'BTC', label: 'MWK → BTC' },
    { from: 'USD', to: 'BTC', label: 'USD → BTC' },
  ];

  const marketData = [
    { pair: 'MWK/USD', rate: '0.00059', change: '+0.12%', trend: 'up' },
    { pair: 'USD/MWK', rate: '1700', change: '-0.08%', trend: 'down' },
    { pair: 'BTC/USD', rate: '53,000', change: '+2.45%', trend: 'up' },
    { pair: 'ETH/USD', rate: '3,100', change: '+1.23%', trend: 'up' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Currency Exchange</h2>
        <p className="text-gray-600">Exchange between multiple currencies at competitive rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Currency</CardTitle>
              <CardDescription>Convert between MWK, USD, and cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-4">
                <div>
                  <Label>From</Label>
                  <div className="mt-2 p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MWK">MWK</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="text-right text-xl font-semibold border-0 p-0 focus-visible:ring-0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    {fromWallet && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => setAmount(fromWallet.balance.toString())}
                        >
                          {fromWallet.balance.toLocaleString()} {fromCurrency}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={swapCurrencies}
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* To Currency */}
                <div>
                  <Label>To</Label>
                  <div className="mt-2 p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MWK">MWK</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-right">
                        <p className="text-xl font-semibold">
                          {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800">Exchange Rate</p>
                    <p className="text-lg font-semibold text-blue-900">
                      1 {fromCurrency} = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCurrency}
                    </p>
                  </div>
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <Button
                onClick={handleExchange}
                disabled={!amount || loading || parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
              >
                {loading ? 'Exchanging...' : `Exchange ${fromCurrency} to ${toCurrency}`}
              </Button>

              {/* Popular Pairs */}
              <div>
                <Label className="mb-3 block">Popular Pairs</Label>
                <div className="grid grid-cols-2 gap-2">
                  {popularPairs.map((pair) => (
                    <Button
                      key={pair.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFromCurrency(pair.from);
                        setToCurrency(pair.to);
                      }}
                    >
                      {pair.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crypto Trading</CardTitle>
              <CardDescription>Buy, sell, and trade cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-orange-600">₿</span>
                        </div>
                        <div>
                          <p className="font-semibold">Bitcoin</p>
                          <p className="text-sm text-gray-600">BTC</p>
                        </div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold mb-1">$53,000</p>
                    <p className="text-sm text-green-600">+2.45% (24h)</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">Ξ</span>
                        </div>
                        <div>
                          <p className="font-semibold">Ethereum</p>
                          <p className="text-sm text-gray-600">ETH</p>
                        </div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold mb-1">$3,100</p>
                    <p className="text-sm text-green-600">+1.23% (24h)</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <p className="font-semibold mb-1">Start Crypto Trading</p>
                  <p className="text-sm opacity-90 mb-3">
                    Buy and sell Bitcoin, Ethereum, and other cryptocurrencies with MWK or USD
                  </p>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Wallets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{wallet.currency}</span>
                    <span className="text-sm text-gray-600">Balance</span>
                  </div>
                  <p className="text-lg font-bold">{wallet.balance.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.map((item) => (
                <div key={item.pair} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.pair}</p>
                    <p className="text-xs text-gray-600">{item.rate}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{item.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Exchange Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Real-time exchange rates</p>
              <p>• Instant currency conversion</p>
              <p>• Competitive spreads</p>
              <p>• Support for crypto trading</p>
              <p>• 24/7 availability</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
