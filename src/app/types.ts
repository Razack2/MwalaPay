export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_started';
  kycDocuments?: {
    idType: string;
    idNumber: string;
    idDocument?: string;
    selfie?: string;
    proofOfAddress?: string;
  };
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: 'MWK' | 'USD' | 'BTC' | 'ETH';
  balance: number;
  accountNumber: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal' | 'exchange' | 'card_payment';
  amount: number;
  currency: string;
  fromAccount?: string;
  toAccount?: string;
  recipient?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  timestamp: string;
  fee?: number;
}

export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  type: 'visa' | 'mastercard';
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

export interface LinkedAccount {
  id: string;
  userId: string;
  type: 'bank' | 'mobile_money';
  provider: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}
