import { create } from "zustand";

const useProposalStore = create((set, get) => ({
  loading: true,
  proposals: [],
  setProposals: async (proposals) => {
    set((state) => ({ ...state, proposals, loading: false }));
  },
  getProposal: (id) => {
    return get().proposals.find((p) => p.id === id);
  },
  removeProposal: async (id) => {
    set((state) => ({
      proposals: state.proposals.filter((p) => p.id !== id),
    }));
  },
  clearProposals: async () => set({ proposals: [] }),

  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));

export default useProposalStore;
