// Shared authentication utilities for use across multiple apps in the monorepo.

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Dummy login implementation that would normally call an API
export async function login(email: string, password: string): Promise<User> {
  // placeholder: in a real app you'd call fetch('/api/login', ...)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 'user-123', email });
    }, 500);
  });
}

export async function logout(): Promise<void> {
  // placeholder for sign out logic
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export function isAuthenticated(): boolean {
  // example stub
  return false;
}
