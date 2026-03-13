# Database Schema

## Overview

The database supports core financial operations including:

- user accounts
- wallet balances
- transactions
- ledger entries

## Tables

### Users

Stores account information.

Fields:

id
phone
name
email
kyc_level
created_at

### Wallets

Stores wallet balances per currency.

Fields:

id
user_id
currency
balance

### Transactions

Represents financial operations.

Fields:

id
user_id
type
amount
fee
status
reference
created_at

### Ledger

Stores immutable accounting records.

Fields:

id
transaction_id
debit_account
credit_account
amount
description
created_at

## Ledger Principle

Each transaction generates **two entries**:

Debit Account  
Credit Account

This ensures:

- financial integrity
- audit capability
- balance verification