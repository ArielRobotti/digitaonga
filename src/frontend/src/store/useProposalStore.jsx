import { create } from "zustand";

const proposals = [];

const useProposalStore = create((set) => ({
  proposals,
  setProposals: async (proposals) => {
    set((state) => ({ proposals }));
  },
  removeProposal: async (id) => {
    set((state) => ({
      proposals: state.proposals.filter((n) => n.id !== id),
    }));
  },
  clearProposals: async () => set({ proposals: [] }),
}));

export default useProposalStore;
