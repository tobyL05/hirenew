import { create } from "zustand"

interface UIDStore {
    uid: string
    setUid: (newUid: string) => void
}

export const useUidStore = create<UIDStore>((set) => ({
    uid: "",
    setUid: (newUid: string) => set({ uid: newUid }), // Correctly sets the new uid
}))