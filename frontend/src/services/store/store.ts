import { create } from "zustand";
import {
  AuthenticationSlice,
  createAuthenticationSlice,
} from "./slices/authentication-slice";

export const useBoundStore = create<AuthenticationSlice>((...a) => ({
  ...createAuthenticationSlice(...a),
}));
