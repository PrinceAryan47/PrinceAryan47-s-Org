export function getAuthErrorMessage(error: any): string {
  const code = error.code || '';
  
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is badly formatted.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use by another account.';
    case 'auth/weak-password':
      return 'The password is too weak. It must be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}
