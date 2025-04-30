import { create } from "zustand";

const useProposalStore = create((set, get) => ({
  loading: true,
  creating: false,
  proposals: [],
  setProposals: async (proposals) => {
    set((state) => ({ ...state, proposals, loading: false }));
  },
  getProposal: (id) => {
    return get().proposals.find((p) => p.id === id);
  },
  addProposal: async (proposal) => {
    set((state) => ({
      proposals: [...state.proposals, proposal],
    }));
  },
  likeProposal: (id, principal) => {
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: p.likes + 1,
              likers: p.likers.map((l) => (l.principal === principal ? { ...l, type: "Like" } : l)),
            }
          : p
      ),
    }));
  },
  dislikeProposal: (id, principal) => {
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              dislikes: p.dislikes + 1,
              likers: p.likers.map((l) =>
                l.principal === principal ? { ...l, type: "Dislike" } : l
              ),
            }
          : p
      ),
    }));
  },
  toggleCreating: () => set((state) => ({ creating: !state.creating })),
  removeProposal: async (id) => {
    set((state) => ({
      proposals: state.proposals.filter((p) => p.id !== id),
    }));
  },
  clearProposals: async () => set({ proposals: [] }),

  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));

export default useProposalStore;
