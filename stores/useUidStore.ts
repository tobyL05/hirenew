import { create } from "zustand"

interface UIDStore {
    uid: string
    setUid: (newUid: string) => void
}

export const useUidStore = create<UIDStore>((set) => ({
    uid: "",
    setUid: () => set((state: UIDStore) => ({ uid: state.uid})),
  }))