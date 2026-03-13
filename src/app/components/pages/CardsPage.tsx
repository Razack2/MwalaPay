import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cardService } from '../../services/cardService';
import { walletService } from '../../services/walletService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { CreditCard, Plus, Eye, EyeOff, Copy, Trash2, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import type { VirtualCard } from '../../types';

export function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [newCardData, setNewCardData] = useState({
    currency: 'USD',
    type: 'visa' as 'visa' | 'mastercard',
  });
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    if (user) {
      const userCards = cardService.getCards(user.id);
      setCards(userCards.map(card => ({ ...card, cardHolder: user.fullName.toUpperCase() })));
    }
  }, [user]);

  const handleCreateCard = () => {
    if (!user) return;

    if (user.kycStatus !== 'verified') {
      toast.error('Please complete KYC verification to create virtual cards');
      return;
    }

    const newCard = cardService.createCard(user.id, newCardData.currency, newCardData.type);
    newCard.cardHolder = user.fullName.toUpperCase();
    setCards([...cards, newCard]);
    toast.success('Virtual card created successfully!');
    setCreateDialogOpen(false);
  };

  const handleFundCard = () => {
    if (!selectedCard || !fundAmount) return;

    const card = cards.find(c => c.id === selectedCard);
    if (!card) return;

    const wallet = walletService.getWallets(user!.id).find(w => w.currency === card.currency);
    if (!wallet || wallet.balance < parseFloat(fundAmount)) {
      toast.error('Insufficient wallet balance');
      return;
    }

    cardService.fundCard(selectedCard, parseFloat(fundAmount));
    walletService.updateWalletBalance(user!.id, card.currency, -parseFloat(fundAmount));

    setCards(cards.map(c => c.id === selectedCard ? { ...c, balance: c.balance + parseFloat(fundAmount) } : c));
    toast.success('Card funded successfully!');
    setFundDialogOpen(false);
    setFundAmount('');
  };

  const handleToggleCard = (cardId: string) => {
    cardService.toggleCardStatus(cardId);
    setCards(cards.map(c => c.id === cardId ? { ...c, isActive: !c.isActive } : c));
    const card = cards.find(c => c.id === cardId);
    toast.success(`Card ${card?.isActive ? 'frozen' : 'activated'}`);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      cardService.deleteCard(cardId);
      setCards(cards.filter(c => c.id !== cardId));
      toast.success('Card deleted successfully');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    toast.success(`${label} copied`);
  };

  const maskCardNumber = (number: string) => {
    const parts = number.split(' ');
    return `${parts[0]} •••• •••• ${parts[3]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Virtual Cards</h2>
          <p className="text-gray-600">Manage your virtual cards for online payments</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Virtual Card</DialogTitle>
              <DialogDescription>
                Create a new virtual card for online payments and international shopping
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Card Type</Label>
                <Select
                  value={newCardData.type}
                  onValueChange={(value: 'visa' | 'mastercard') => setNewCardData({ ...newCardData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={newCardData.currency}
                  onValueChange={(value) => setNewCardData({ ...newCardData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="MWK">MWK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Virtual cards are perfect for online shopping, subscriptions, and international payments. Fund your card from your wallet anytime.
                </p>
              </div>
              <Button onClick={handleCreateCard} className="w-full">
                Create Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {user?.kycStatus !== 'verified' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">KYC Verification Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  Complete your KYC verification to create and use virtual cards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Virtual Cards Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first virtual card to start shopping online and making international payments
            </p>
            {user?.kycStatus === 'verified' && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Card
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="space-y-4">
              <div className="relative">
                {/* Card Visual */}
                <div className={`
                  relative h-56 rounded-2xl p-6 text-white overflow-hidden
                  ${card.type === 'visa'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900'
                  }
                `}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-10 h-10" />
                      <span className="text-2xl font-bold uppercase">{card.type}</span>
                    </div>
                    <div>
                      <p className="text-lg font-mono tracking-wider mb-4">
                        {showDetails[card.id] ? card.cardNumber : maskCardNumber(card.cardNumber)}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs opacity-75 mb-1">CARDHOLDER</p>
                          <p className="font-medium">{card.cardHolder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75 mb-1">EXPIRES</p>
                          <p className="font-medium">{card.expiryDate}</p>
                        </div>
                        {showDetails[card.id] && (
                          <div className="text-right">
                            <p className="text-xs opacity-75 mb-1">CVV</p>
                            <p className="font-medium">{card.cvv}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!card.isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-semibold">Card Frozen</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Card Balance</p>
                      <p className="text-2xl font-bold">{card.currency} {card.balance.toLocaleString()}</p>
                    </div>
                    <Dialog open={fundDialogOpen && selectedCard === card.id} onOpenChange={(open) => {
                      setFundDialogOpen(open);
                      if (open) setSelectedCard(card.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm">Fund Card</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Fund Card</DialogTitle>
                          <DialogDescription>Transfer money from your wallet to this card</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Amount ({card.currency})</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleFundCard} className="w-full">
                            Confirm Transfer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails({ ...showDetails, [card.id]: !showDetails[card.id] })}
                    >
                      {showDetails[card.id] ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {card.isActive ? 'Card Active' : 'Card Frozen'}
                      </span>
                    </div>
                    <Switch
                      checked={card.isActive}
                      onCheckedChange={() => handleToggleCard(card.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>International Payments</span>
            </CardTitle>
            <CardDescription>Where you can use your virtual cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Amazon', 'Netflix', 'Spotify', 'PayPal', 'Google Pay', 'Apple Pay'].map((service) => (
                <div key={service} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{service}</p>
                    <p className="text-xs text-green-600">Supported</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
