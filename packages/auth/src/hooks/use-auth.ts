import { useState, useEffect } from 'react';
import { isAuthenticated, login, logout, User } from '..';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      // fetch user info
    }
  }, []);

  return { user, login, logout };
}
