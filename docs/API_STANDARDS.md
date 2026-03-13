# API Standards

## Overview

The MwalaPay API follows RESTful design principles.

All responses use JSON.

## Base Format

Request

POST /api/wallet/transfer

Response

{
 "success": true,
 "data": {}
}

## HTTP Status Codes

200 Success  
400 Bad Request  
401 Unauthorized  
403 Forbidden  
404 Not Found  
500 Server Error

## Authentication

Authentication uses token-based sessions.

Authorization header example:

Authorization: Bearer <token>

## Error Response Format

{
 "error": "Insufficient balance"
}

## Pagination

Large datasets use pagination.

Example:

GET /api/transactions?page=1&limit=20