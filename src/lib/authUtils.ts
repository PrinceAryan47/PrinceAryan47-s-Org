export function getAuthErrorMessage(error: any): string {
  const code = error.code || '';
  
  switch (code) {
    case 'auth/invalid-email':
      return 'auth.errors.invalid_email';
    case 'auth/user-disabled':
      return 'auth.errors.user_disabled';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'auth.errors.invalid_credential';
    case 'auth/email-already-in-use':
      return 'auth.errors.email_already_in_use';
    case 'auth/weak-password':
      return 'auth.errors.weak_password';
    case 'auth/operation-not-allowed':
      return 'auth.errors.operation_not_allowed';
    case 'auth/network-request-failed':
      return 'auth.errors.network_request_failed';
    case 'auth/too-many-requests':
      return 'auth.errors.too_many_requests';
    default:
      return 'auth.errors.default';
  }
}
