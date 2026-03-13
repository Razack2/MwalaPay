import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export function WalletsPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState(user ? walletService.getWallets(user.id) : []);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');

  const handleDeposit = () => {
    if (!user || !selectedWallet || !amount) return;

    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet) return;

    walletService.depositMoney(user.id, parseFloat(amount), wallet.currency, account || 'Mobile Money');
    setWallets(walletService.getWallets(user.id));
    toast.success(`Deposited ${wallet.currency} ${amount} successfully!`);
    setDepositOpen(false);
    setAmount('');
    setAccount('');
  };

  const handleWithdraw = () => {
    if (!user || !selectedWallet || !amount) return;

    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet) return;

    const success = walletService.withdrawMoney(user.id, parseFloat(amount), wallet.currency, account || 'Mobile Money');
    if (success) {
      setWallets(walletService.getWallets(user.id));
      toast.success(`Withdrew ${wallet.currency} ${amount} successfully!`);
      setWithdrawOpen(false);
      setAmount('');
      setAccount('');
    } else {
      toast.error('Insufficient balance');
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'MWK': return 'MWK';
      case 'USD': return '$';
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      default: return currency;
    }
  };

  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'MWK': return 'Malawian Kwacha';
      case 'USD': return 'US Dollar';
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      default: return currency;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Wallets</h2>
          <p className="text-gray-600">Manage your multi-currency wallets</p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </Button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{wallet.currency}</CardTitle>
                    <CardDescription>{getCurrencyName(wallet.currency)}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Balance</p>
                <p className="text-3xl font-bold">
                  {getCurrencySymbol(wallet.currency)} {wallet.balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="text-sm font-mono">{wallet.accountNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Dialog open={depositOpen && selectedWallet === wallet.id} onOpenChange={(open) => {
                  setDepositOpen(open);
                  if (open) setSelectedWallet(wallet.id);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deposit {wallet.currency}</DialogTitle>
                      <DialogDescription>Add funds to your {wallet.currency} wallet</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>From Account</Label>
                        <Select value={account} onValueChange={setAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                            <SelectItem value="TNM Mpamba">TNM Mpamba</SelectItem>
                            <SelectItem value="National Bank">National Bank</SelectItem>
                            <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleDeposit} className="w-full">
                        Confirm Deposit
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={withdrawOpen && selectedWallet === wallet.id} onOpenChange={(open) => {
                  setWithdrawOpen(open);
                  if (open) setSelectedWallet(wallet.id);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw {wallet.currency}</DialogTitle>
                      <DialogDescription>Transfer funds from your {wallet.currency} wallet</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Available: {getCurrencySymbol(wallet.currency)} {wallet.balance.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>To Account</Label>
                        <Select value={account} onValueChange={setAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                            <SelectItem value="TNM Mpamba">TNM Mpamba</SelectItem>
                            <SelectItem value="National Bank">National Bank</SelectItem>
                            <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleWithdraw} className="w-full">
                        Confirm Withdrawal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>Manage your connected banks and mobile money</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              Link Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { provider: 'Airtel Money', account: '+265 999 123 456', type: 'mobile_money' },
              { provider: 'National Bank', account: '****1234', type: 'bank' },
            ].map((account, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{account.provider}</p>
                    <p className="text-sm text-gray-600">{account.account}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
