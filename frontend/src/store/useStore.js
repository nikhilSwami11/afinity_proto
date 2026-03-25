import { create } from 'zustand';

const useStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));

export default useStore;
