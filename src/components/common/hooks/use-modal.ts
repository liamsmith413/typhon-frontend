import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  toggleModal: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));