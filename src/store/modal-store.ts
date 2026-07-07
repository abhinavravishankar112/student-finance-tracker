import { create } from 'zustand'

interface ModalState {
  isTransactionModalOpen: boolean
  openTransactionModal: () => void
  closeTransactionModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isTransactionModalOpen: false,
  openTransactionModal: () => set({ isTransactionModalOpen: true }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),
}))