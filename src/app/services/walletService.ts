import type { Wallet, Transaction, ExchangeRate } from '../types';

export const walletService = {
  getWallets: (userId: string): Wallet[] => {
    const wallets = JSON.parse(localStorage.getItem('mwalapay_wallets') || '[]');
    return wallets.filter((w: Wallet) => w.userId === userId);
  },

  getWalletBalance: (userId: string, currency: string): number => {
    const wallets = walletService.getWallets(userId);
    const wallet = wallets.find(w => w.currency === currency);
    return wallet?.balance || 0;
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = JSON.parse(localStorage.getItem('mwalapay_transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('mwalapay_transactions', JSON.stringify(transactions));
  },

  getTransactions: (userId: string, limit?: number): Transaction[] => {
    const transactions = JSON.parse(localStorage.getItem('mwalapay_transactions') || '[]');
    const userTransactions = transactions.filter((t: Transaction) => t.userId === userId);
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  },

  updateWalletBalance: (userId: string, currency: string, amount: number): void => {
    const wallets = JSON.parse(localStorage.getItem('mwalapay_wallets') || '[]');
    const walletIndex = wallets.findIndex((w: Wallet) => w.userId === userId && w.currency === currency);

    if (walletIndex !== -1) {
      wallets[walletIndex].balance += amount;
      localStorage.setItem('mwalapay_wallets', JSON.stringify(wallets));
    }
  },

  sendMoney: (userId: string, amount: number, currency: string, recipient: string, description: string): boolean => {
    const balance = walletService.getWalletBalance(userId, currency);
    const fee = amount * 0.01; // 1% fee
    const total = amount + fee;

    if (balance < total) {
      return false;
    }

    // Deduct from sender
    walletService.updateWalletBalance(userId, currency, -total);

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'send',
      amount,
      currency,
      recipient,
      status: 'completed',
      description,
      timestamp: new Date().toISOString(),
      fee,
    };
    walletService.addTransaction(transaction);

    return true;
  },

  depositMoney: (userId: string, amount: number, currency: string, fromAccount: string): void => {
    walletService.updateWalletBalance(userId, currency, amount);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'deposit',
      amount,
      currency,
      fromAccount,
      status: 'completed',
      description: `Deposit from ${fromAccount}`,
      timestamp: new Date().toISOString(),
    };
    walletService.addTransaction(transaction);
  },

  withdrawMoney: (userId: string, amount: number, currency: string, toAccount: string): boolean => {
    const balance = walletService.getWalletBalance(userId, currency);

    if (balance < amount) {
      return false;
    }

    walletService.updateWalletBalance(userId, currency, -amount);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'withdrawal',
      amount,
      currency,
      toAccount,
      status: 'completed',
      description: `Withdrawal to ${toAccount}`,
      timestamp: new Date().toISOString(),
    };
    walletService.addTransaction(transaction);

    return true;
  },

  exchangeCurrency: (userId: string, fromCurrency: string, toCurrency: string, amount: number): boolean => {
    const balance = walletService.getWalletBalance(userId, fromCurrency);

    if (balance < amount) {
      return false;
    }

    const rate = walletService.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    walletService.updateWalletBalance(userId, fromCurrency, -amount);
    walletService.updateWalletBalance(userId, toCurrency, convertedAmount);

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'exchange',
      amount,
      currency: fromCurrency,
      status: 'completed',
      description: `Exchanged ${fromCurrency} to ${toCurrency}`,
      timestamp: new Date().toISOString(),
    };
    walletService.addTransaction(transaction);

    return true;
  },

  getExchangeRate: (from: string, to: string): number => {
    // Mock exchange rates
    const rates: Record<string, Record<string, number>> = {
      MWK: { USD: 0.00059, BTC: 0.000000011, ETH: 0.00000019 },
      USD: { MWK: 1700, BTC: 0.000019, ETH: 0.00032 },
      BTC: { MWK: 90000000, USD: 53000, ETH: 17 },
      ETH: { MWK: 5300000, USD: 3100, BTC: 0.059 },
    };
    return rates[from]?.[to] || 1;
  },
};
