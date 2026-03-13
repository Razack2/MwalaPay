import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Send, User, Phone, Mail, Building2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function SendMoneyPage() {
  const { user } = useAuth();
  const [wallets] = useState(user ? walletService.getWallets(user.id) : []);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'MWK',
    description: '',
    method: 'mwalapay' as 'mwalapay' | 'mobile' | 'bank' | 'international',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const success = walletService.sendMoney(
      user.id,
      parseFloat(formData.amount),
      formData.currency,
      formData.recipient,
      formData.description || 'Money transfer'
    );

    if (success) {
      toast.success('Money sent successfully!');
      setFormData({
        recipient: '',
        amount: '',
        currency: 'MWK',
        description: '',
        method: 'mwalapay',
      });
    } else {
      toast.error('Insufficient balance');
    }

    setLoading(false);
  };

  const wallet = wallets.find(w => w.currency === formData.currency);
  const fee = formData.amount ? parseFloat(formData.amount) * 0.01 : 0;
  const total = formData.amount ? parseFloat(formData.amount) + fee : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Send Money</h2>
        <p className="text-gray-600">Transfer money securely to anyone, anywhere</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Choose how you want to send money</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value as any })}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="mwalapay">MwalaPay</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                  <TabsTrigger value="international">International</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <TabsContent value="mwalapay" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label>Recipient</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Email, phone, or account number"
                          className="pl-10"
                          value={formData.recipient}
                          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mobile" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label>Mobile Money Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="+265 999 123 456"
                          className="pl-10"
                          value={formData.recipient}
                          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="tnm">TNM Mpamba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label>Bank Account Number</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Account number"
                          className="pl-10"
                          value={formData.recipient}
                          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">National Bank of Malawi</SelectItem>
                          <SelectItem value="standard">Standard Bank</SelectItem>
                          <SelectItem value="nedbank">Nedbank</SelectItem>
                          <SelectItem value="fmb">FMB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="international" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label>Recipient Email or PayPal</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="email@example.com"
                          className="pl-10"
                          value={formData.recipient}
                          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        International transfers are processed through our partner network and may take 1-3 business days.
                      </p>
                    </div>
                  </TabsContent>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MWK">MWK</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input
                      placeholder="What's this for?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Sending...' : 'Send Money'}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formData.currency} {formData.amount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee (1%):</span>
                <span className="font-medium">{formData.currency} {fee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">{formData.currency} {total.toFixed(2)}</span>
              </div>
              {wallet && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Available Balance:</p>
                  <p className="text-lg font-semibold">{formData.currency} {wallet.balance.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['John Banda', 'Sarah Phiri', 'Mike Chikaonda'].map((name) => (
                <button
                  key={name}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                  onClick={() => setFormData({ ...formData, recipient: name })}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm">{name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
