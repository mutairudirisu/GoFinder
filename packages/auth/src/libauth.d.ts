// ambient types for auth package

declare module '@repo/auth' {
  export interface User {
    id: string;
    email: string;
    name?: string;
  }

  export function login(email: string, password: string): Promise<User>;
  export function logout(): Promise<void>;
  export function isAuthenticated(): boolean;
}
