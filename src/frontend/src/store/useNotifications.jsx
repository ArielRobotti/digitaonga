import { create } from "zustand";

// Mocks data
const notifications = [
  {
    id: 1,
    type: "proposal",
    description: "User name liked your comment in Proposal #456",
    time: "1 day ago",
  },
  {
    id: 2,
    type: "invite",
    description: "User name invited you to join placeholder DAO",
    time: "2 days ago",
  },
  {
    id: 3,
    type: "proposal",
    description: "User name liked your comment in Proposal #456",
    time: "3 day ago",
  },
];

const useNotification = create((set) => ({
  notifications,
  checkNotifications: async () => {
    set((state) => ({ notifications }));
  },
  removeNotification: async (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  clearNotification: async () => set({ notifications: [] }),
}));

export default useNotification;
