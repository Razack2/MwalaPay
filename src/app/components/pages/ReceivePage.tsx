import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QrCode, Copy, Check, Download, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';

export function ReceivePage() {
  const { user } = useAuth();
  const [wallets] = useState(user ? walletService.getWallets(user.id) : []);
  const [selectedCurrency, setSelectedCurrency] = useState('MWK');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const selectedWallet = wallets.find(w => w.currency === selectedCurrency);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateQRPayload = () => {
    return JSON.stringify({
      recipient: selectedWallet?.accountNumber,
      currency: selectedCurrency,
      amount: amount || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Receive Money</h2>
        <p className="text-gray-600">Share your payment details to receive money</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receive Money</CardTitle>
            <CardDescription>Choose your preferred receiving method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="details">Account Details</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label>Select Wallet</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => (
                      <Button
                        key={wallet.id}
                        variant={selectedCurrency === wallet.currency ? 'default' : 'outline'}
                        onClick={() => setSelectedCurrency(wallet.currency)}
                      >
                        {wallet.currency}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Leave empty for any amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="p-8 bg-white border-2 rounded-lg flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Scan this QR code to send money to this wallet
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label>Select Wallet</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => (
                      <Button
                        key={wallet.id}
                        variant={selectedCurrency === wallet.currency ? 'default' : 'outline'}
                        onClick={() => setSelectedCurrency(wallet.currency)}
                      >
                        {wallet.currency}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedWallet && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Account Number</p>
                        <div className="flex items-center justify-between">
                          <p className="font-mono font-medium">{selectedWallet.accountNumber}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(selectedWallet.accountNumber, 'Account number')}
                          >
                            {copied === 'Account number' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Account Name</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{user?.fullName}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(user?.fullName || '', 'Account name')}
                          >
                            {copied === 'Account name' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{user?.email}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(user?.email || '', 'Email')}
                          >
                            {copied === 'Email' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{user?.phoneNumber}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(user?.phoneNumber || '', 'Phone')}
                          >
                            {copied === 'Phone' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Share any of these details with the sender. They can use your account number, email, or phone number to send you money.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Wallets</CardTitle>
              <CardDescription>Available balances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCurrency === wallet.currency
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <WalletIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{wallet.currency}</p>
                        <p className="text-sm text-gray-600">{wallet.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{wallet.balance.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{wallet.currency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Receive Money</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Select the wallet you want to receive money in</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Share your QR code or account details with the sender</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Money will be credited instantly to your wallet</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
