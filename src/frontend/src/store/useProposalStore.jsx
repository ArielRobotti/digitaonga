import { create } from "zustand";

const useProposalStore = create((set, get) => ({
  loading: true,
  creating: false,
  proposals: [],
  pending: { loading: true, data: [] },
  approved: { loading: true, data: [] },
  rejected: { loading: true, data: [] },
  setProposals: async (proposals) => set(() => ({ proposals, loading: false })),
  setPending: (pending) => set(() => ({ pending, loading: false })),
  setApproved: (approved) => set(() => ({ approved, loading: false })),
  setRejected: (rejected) => set(() => ({ rejected, loading: false })),
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
