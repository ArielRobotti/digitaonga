import { create } from "zustand";

const useMemberStore = create((set, get) => ({
  loading: true,
  creating: false,
  member: { loading: true, data: null },
  setMember: async (member) =>
    set((state) => ({ ...state, member: { loading: false, data: member }, loading: false })),
  toggleCreating: () => set((state) => ({ creating: !state.creating })),
  removeMember: async () => set({ member: { loading: true, data: null } }),
  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));

export default useMemberStore;
