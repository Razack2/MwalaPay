import type { VirtualCard } from '../types';

export const cardService = {
  getCards: (userId: string): VirtualCard[] => {
    const cards = JSON.parse(localStorage.getItem('mwalapay_cards') || '[]');
    return cards.filter((c: VirtualCard) => c.userId === userId);
  },

  createCard: (userId: string, currency: string, type: 'visa' | 'mastercard'): VirtualCard => {
    const cards = JSON.parse(localStorage.getItem('mwalapay_cards') || '[]');

    const newCard: VirtualCard = {
      id: `card_${Date.now()}`,
      userId,
      cardNumber: generateCardNumber(type),
      cardHolder: '', // Will be set from user profile
      expiryDate: generateExpiryDate(),
      cvv: Math.floor(Math.random() * 900 + 100).toString(),
      type,
      currency,
      balance: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    cards.push(newCard);
    localStorage.setItem('mwalapay_cards', JSON.stringify(cards));
    return newCard;
  },

  fundCard: (cardId: string, amount: number): void => {
    const cards = JSON.parse(localStorage.getItem('mwalapay_cards') || '[]');
    const cardIndex = cards.findIndex((c: VirtualCard) => c.id === cardId);

    if (cardIndex !== -1) {
      cards[cardIndex].balance += amount;
      localStorage.setItem('mwalapay_cards', JSON.stringify(cards));
    }
  },

  toggleCardStatus: (cardId: string): void => {
    const cards = JSON.parse(localStorage.getItem('mwalapay_cards') || '[]');
    const cardIndex = cards.findIndex((c: VirtualCard) => c.id === cardId);

    if (cardIndex !== -1) {
      cards[cardIndex].isActive = !cards[cardIndex].isActive;
      localStorage.setItem('mwalapay_cards', JSON.stringify(cards));
    }
  },

  deleteCard: (cardId: string): void => {
    const cards = JSON.parse(localStorage.getItem('mwalapay_cards') || '[]');
    const updatedCards = cards.filter((c: VirtualCard) => c.id !== cardId);
    localStorage.setItem('mwalapay_cards', JSON.stringify(updatedCards));
  },
};

function generateCardNumber(type: 'visa' | 'mastercard'): string {
  const prefix = type === 'visa' ? '4' : '5';
  let number = prefix;
  for (let i = 0; i < 15; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number.match(/.{1,4}/g)?.join(' ') || number;
}

function generateExpiryDate(): string {
  const now = new Date();
  const futureYear = now.getFullYear() + 3;
  const month = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
  return `${month}/${futureYear.toString().slice(2)}`;
}
