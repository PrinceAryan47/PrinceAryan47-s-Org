# Security Specification for HAM Grounds

## 1. Data Invariants
- A user can only edit their own profile.
- A user cannot change their own role after creation (must be set by admin or fixed at registration).
- Products can only be created/edited/deleted by the wholesaler who owns them.
- Orders can only be viewed/updated by the buyer or the wholesaler involved in the order.
- Sales records (ledger) are strictly private to the wholesaler who generated them.
- All timestamps must be server-generated (`request.time`).
- All numeric values (price, stock, quantity) must be non-negative.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: Buyer A tries to update Buyer B's profile.
2. **Privilege Escalation**: Buyer tries to change their role to 'wholesaler' via direct Firestore update.
3. **Orphaned Product**: User tries to create a product for a wholesaler UID that isn't theirs.
4. **Price Poisoning**: Wholesaler tries to set a negative `wholesalePrice`.
5. **Stock Poisoning**: Wholesaler tries to set a negative `stock`.
6. **Unauthorized Read**: Buyer A tries to read Wholesaler B's `sales` ledger.
7. **Order Hijacking**: Buyer A tries to read an order belonging to Buyer C.
8. **Status Shortcut**: Buyer tries to mark an order as 'delivered' when only the wholesaler can update status transitions or vice-versa.
9. **Creation Timestamp Spoof**: User tries to set `createdAt` to a date in the past.
10. **Shadow Field Injection**: User tries to add an `isAdmin: true` field to their profile.
11. **Inventory Deduction Bypass**: Record a sale without reducing stock (atomicity check - logic handled by app but rules should ensure records are valid).
12. **Malicious ID**: Attempting to create a document with a 2MB string as ID.

## 3. Test Runner Plan
The `firestore.rules.test.ts` will focus on:
- Validating that `request.auth.uid` matches the document owner.
- Validating schema shapes via helpers.
- Validating state transitions.
