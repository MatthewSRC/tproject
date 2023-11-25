import { StateCreator } from "zustand";

export const createAuthenticationSlice: StateCreator<AuthenticationSlice> = (
  set
) => ({
  isAuthenticated: false,
  setAuthenticated: (input) => set(() => ({ isAuthenticated: input })),
});

export interface AuthenticationSlice {
  isAuthenticated: boolean;
  setAuthenticated: (input: boolean) => void;
}
