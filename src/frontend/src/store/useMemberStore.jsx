import { create } from "zustand";

const useMemberStore = create((set, get) => ({
  loading: true,
  creating: false,
  member: null,
  setMember: async (member) => set((state) => ({ ...state, member, loading: false })),
  toggleCreating: () => set((state) => ({ creating: !state.creating })),
  removeMember: async () => set({ member: null }),
  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));

export default useMemberStore;
