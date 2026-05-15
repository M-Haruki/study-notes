import { create } from "zustand";

type UserStore = {
  userID: string | null;
  setUserID: (id: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userID: null,
  setUserID: (id: string | null) =>
    set(() => ({
      userID: id,
    })),
}));
