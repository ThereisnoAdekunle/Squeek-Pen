export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  handle: string | null;
  avatar: string | null;
  id: string | null;
  token: string | null;
  login: () => void;
  logout: () => void;
};
export const guestAuth: AuthState = {
  ready: true,
  authenticated: false,
  handle: null,
  avatar: null,
  id: null,
  token: null,
  login: () => {},
  logout: () => {},
};
