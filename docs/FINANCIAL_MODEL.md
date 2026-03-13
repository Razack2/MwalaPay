# Financial Model

## Overview

The financial model of MwalaPay defines how funds flow through the platform, how transactions are recorded, and how revenue is generated while maintaining transparency and regulatory compliance.

MwalaPay uses a **ledger-first financial system**, meaning every financial event is recorded in an immutable ledger using double-entry accounting.

This model ensures:

- Financial accuracy
- Auditability
- Transaction traceability
- Regulatory compliance

The ledger serves as the **single source of truth** for all wallet balances and transaction records.

# Core Financial Principles

The platform follows these financial engineering rules:

1. **Balances are computed, not stored manually**
2. **Every financial movement must generate ledger entries**
3. **Debits must always equal credits**
4. **Transactions cannot be edited once recorded**
5. **Errors must be corrected using reversal transactions**

These principles guarantee financial consistency across the platform.

# Revenue Model

MwalaPay generates revenue through small service fees applied to specific financial operations.

The platform focuses on **ultra-low fees** to remain accessible and competitive.

## Fee Structure

| Transaction Type | Fee |
|-----------------|------|
| Deposit | 0.1% |
| Peer-to-Peer Transfer | 0.5% |
| Merchant Payment | 0% |
| Currency Conversion | 1% |
| Crypto Trading | 1.5% |

The goal is to maintain affordability while sustaining platform operations.

# Example Revenue Scenario

If a user transfers **MWK 10,000**:

Transfer fee = 0.5%

Fee calculation:

10,000 × 0.005 = **MWK 50**

Ledger entries:

Debit: User Wallet — 10,050  
Credit: Recipient Wallet — 10,000  
Credit: MwalaPay Fee Account — 50

# Transaction Types

The platform supports several transaction categories.

## Deposits

Funds entering the platform from external sources.

Sources may include:

- Mobile money
- Bank accounts
- International payment networks
- Crypto wallets

Example ledger entries:

Debit: Mobile Money Pool  
Credit: User Wallet

Fee entry:

Debit: User Wallet  
Credit: Platform Fee Account

## Withdrawals

Funds leaving the platform to external financial systems.

Example:

Debit: User Wallet  
Credit: Mobile Money Settlement Account

## Peer-to-Peer Transfers

Users send funds directly to each other.

Example ledger entries:

Debit: Sender Wallet  
Credit: Receiver Wallet

Fee entry:

Debit: Sender Wallet  
Credit: Platform Fee Account

## Merchant Payments

Users can pay businesses using their wallet balance.

Example:

Debit: Customer Wallet  
Credit: Merchant Wallet

Merchant payments may not incur user fees to encourage commerce.

# Cross-Border Payments

Cross-border payments allow users to pay international services using local currency.

Example flow:

User Wallet (MWK)  
→ Currency Conversion  
→ Settlement Partner  
→ Merchant Account

Partners may include:

- PayPal
- Mastercard

Currency exchange fees may apply.

# Settlement Model

Settlement ensures external partners receive correct payment amounts.

Settlement accounts include:

Mobile Money Settlement Account  
Bank Settlement Account  
International Payment Settlement Account

These accounts reconcile platform balances with partner institutions.

Settlement occurs:

- Daily
- Hourly for high-volume transactions

# Liquidity Management

The platform must maintain sufficient liquidity in external financial systems.

Liquidity pools include:

- Bank reserves
- Mobile money float accounts
- Crypto liquidity pools

Liquidity ensures:

- fast withdrawals
- uninterrupted payment services

# Risk Management

Risk controls protect the financial system from fraud and operational failures.

Controls include:

- transaction limits
- fraud detection algorithms
- KYC verification
- AML monitoring

Suspicious transactions may trigger:

- manual review
- temporary account restrictions

# Audit and Compliance

MwalaPay maintains full financial transparency.

Audit mechanisms include:

- immutable ledger records
- transaction traceability
- reconciliation reports
- regulator reporting

These features support compliance with financial regulations and external audits.

# Financial Sustainability

MwalaPay aims to balance affordability with sustainable revenue.

The model focuses on:

- low fees
- high transaction volume
- merchant ecosystem growth
- international payment capabilities

This strategy encourages platform adoption while ensuring long-term operational stability.

# Long-Term Expansion

Future financial capabilities may include:

- micro-loans
- savings accounts
- merchant financing
- crypto asset management
- cross-border remittances

These services will expand the platform into a full financial ecosystem.

# Summary

MwalaPay’s financial model is built on:

- ledger-first accounting
- transparent transaction processing
- low-cost financial services
- strong regulatory compliance
- scalable payment infrastructure

This approach enables a trusted digital payment platform capable of supporting both local and global financial transactions.