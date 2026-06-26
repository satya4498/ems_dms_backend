# 🚀 Jagdamba Backend API - Postman Collection

This Postman collection provides a complete set of API endpoints for testing the Jagdamba Backend application.

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Collection Overview](#collection-overview)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Testing Workflows](#testing-workflows)

## 🛠️ Setup Instructions

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file
4. The collection will be imported with all endpoints organized by functionality

### 2. Configure Environment Variables
The collection uses the following variables that will be automatically set during testing:

| Variable | Description | Auto-set by |
|----------|-------------|-------------|
| `baseUrl` | API base URL | Manual |
| `authToken` | JWT authentication token | Verify OTP request |
| `userId` | Current user ID | Verify OTP request |
| `qrCodeId` | QR code ID for testing | Manual |
| `redemptionId` | Redemption request ID | Redeem QR Code request |
| `offerId` | Offer ID for testing | Create Offer request |

### 3. Update Base URL
1. Open the collection
2. Go to "Variables" tab
3. Update `baseUrl` to match your server:
   - Local: `http://localhost:3000`
   - Staging: `https://staging-api.jagdamba.com`
   - Production: `https://api.jagdamba.com`

## 📊 Collection Overview

### 🔧 Health Check
- **Health Check**: Verify server status

### 👤 User Management
- **Send OTP**: Send OTP to phone number
- **Verify OTP**: Verify OTP and get authentication token
- **Get User Profile**: Get current user profile
- **Update User Profile**: Update user profile information
- **Get Transaction History**: Get user's transaction history

### 💰 QR Code Payout System
- **Redeem QR Code**: Scan and redeem QR code (adds balance to wallet)
- **Get Pending Redemptions**: Get pending redemption requests (Admin)
- **Approve/Reject Redemption**: Approve or reject redemption requests (Admin)
- **Get All Redemptions**: Get all redemption requests (Admin)

### 🏦 RazorpayX Integration
- **Create Contact**: Create RazorpayX contact
- **Add Bank Account**: Add bank account to contact
- **Get Contact Details**: Get contact information
- **Create Payout**: Create payout to bank account

### 🎁 Offer Management
- **Create Offer**: Create new offer (Admin)
- **Get All Offers**: Get all offers with pagination
- **Get Offer by ID**: Get specific offer details
- **Update Offer**: Update offer details (Admin)
- **Delete Offer**: Delete offer (Admin)

## 🔐 Authentication Flow

### 1. User Registration/Login
```bash
# Step 1: Send OTP
POST /api/v2/user/send-otp
{
  "phoneNumber": "+919876543210"
}

# Step 2: Verify OTP
POST /api/v2/user/verify-otp
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

The "Verify OTP" request automatically sets:
- `authToken` - JWT token for authentication
- `userId` - Current user ID

### 2. Using Authentication
All subsequent requests will automatically include the Bearer token in the Authorization header.

## 📝 API Endpoints

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v2/user/send-otp` | Send OTP to phone | No |
| `POST` | `/api/v2/user/verify-otp` | Verify OTP and login | No |
| `GET` | `/api/v2/user/profile` | Get user profile | Yes |
| `POST` | `/api/v2/user/update-profile` | Update profile | Yes |
| `GET` | `/api/v2/user/transactions` | Get transaction history | Yes |

### QR Code Payout System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v2/payout/redeem-qr` | Redeem QR code | Yes |
| `GET` | `/api/v2/payout/pending-redemptions` | Get pending redemptions | Admin |
| `POST` | `/api/v2/payout/approve-redemption` | Approve/reject redemption | Admin |
| `GET` | `/api/v2/payout/redemptions` | Get all redemptions | Admin |

### RazorpayX Integration
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v2/razorpay/contacts` | Create contact | Yes |
| `POST` | `/api/v2/razorpay/contacts/bank-accounts` | Add bank account | Yes |
| `GET` | `/api/v2/razorpay/contacts/:id` | Get contact details | Yes |
| `POST` | `/api/v2/razorpay/payouts` | Create payout | Yes |

### Offer Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v2/offer/` | Create offer | Admin |
| `GET` | `/api/v2/offer/` | Get all offers | Yes |
| `GET` | `/api/v2/offer/:id` | Get offer by ID | Yes |
| `PUT` | `/api/v2/offer/:id` | Update offer | Admin |
| `DELETE` | `/api/v2/offer/:id` | Delete offer | Admin |

## 🧪 Testing Workflows

### 1. Complete User Journey
1. **Send OTP** → Get OTP via SMS/email
2. **Verify OTP** → Get authentication token
3. **Get User Profile** → Verify user data
4. **Update Profile** → Update user information
5. **Get Transaction History** → View user transactions

### 2. QR Code Payout Flow
1. **Redeem QR Code** → Scan QR and add balance to wallet
2. **Get Pending Redemptions** (Admin) → View pending requests
3. **Approve Redemption** (Admin) → Approve and process payout
4. **Get Transaction History** → Verify wallet transactions

### 3. RazorpayX Integration Flow
1. **Create Contact** → Create RazorpayX contact
2. **Add Bank Account** → Add bank details to contact
3. **Get Contact Details** → Verify contact information
4. **Create Payout** → Process bank transfer

### 4. Offer Management Flow
1. **Create Offer** (Admin) → Create new offer
2. **Get All Offers** → View all offers
3. **Get Offer by ID** → View specific offer
4. **Update Offer** (Admin) → Modify offer details
5. **Delete Offer** (Admin) → Remove offer

## 🔧 Environment Variables

### Required Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "authToken": "",
  "userId": "",
  "qrCodeId": "",
  "redemptionId": "",
  "offerId": ""
}
```

### Auto-Set Variables
- `authToken`: Set by "Verify OTP" request
- `userId`: Set by "Verify OTP" request
- `redemptionId`: Set by "Redeem QR Code" request
- `offerId`: Set by "Create Offer" request

## 🚨 Important Notes

### Authentication
- Most endpoints require authentication via Bearer token
- Admin-only endpoints require admin role
- Token is automatically set after OTP verification

### Error Handling
- All responses follow standard format: `{ data: {}, errors: [] }`
- Check `errors` array for validation/error messages
- HTTP status codes indicate success/failure

### Rate Limiting
- OTP requests may have rate limiting
- Respect API rate limits in production

### Testing Data
- Use test phone numbers for OTP testing
- Use test QR codes for payout testing
- Use test bank accounts for RazorpayX testing

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Verify environment variables
3. Check server logs for errors
4. Contact development team

---

**Happy Testing! 🎉**
