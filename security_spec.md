# Security Specification - HAM GROUNDS

## 1. Data Invariants
- A product must have a valid `sellerId`.
- An order must involve a `buyerId` and `sellerId`.
- A review must reference an existing `productId` and be created by a `buyerId`.
- A sale or expense record must belong to a `sellerId`.
- Notifications must be between a `buyerId` and a `wholesalerId`.

## 2. The "Dirty Dozen" Payloads (Testing Denials)
1. **Unauthorized Product Update**: A user trying to update a product they don't own.
2. **Shadow Field Injection**: Adding an `isAdmin` field to a user profile.
3. **Identity Spoofing**: Creating a review with someone else's `buyerId`.
4. **Relational Sync Bypass**: Creating a sale for a product that doesn't exist.
5. **PII Leak**: A wholesaler trying to read another wholesaler's private sales records.
6. **State Shortcutting**: Updating an order status from `pending` directly to `delivered` by the buyer.
7. **Negative Amount**: Recording an expense with a negative amount.
8. **Orphaned Notification**: Sending a notification to a non-existent wholesaler.
9. **Spam Reviews**: A user creating 1000 reviews in 1 second (Rate limiting).
10. **Resource Poisoning**: Using a 1MB string for a product name.
11. **Email Spoofing**: Attempting a write with `email_verified: false` when required.
12. **Price Manipulation**: A buyer trying to update the price of a product.

## 3. Test Runner (Draft)
A comprehensive test suite will verify these denials.
