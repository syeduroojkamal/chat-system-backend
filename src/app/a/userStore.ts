import { create } from "zustand";

export type User = {
  userId: string;
  fullName: string;
  email: string;
  accountCreated: string | null;
  lastSignIn: string | null;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
