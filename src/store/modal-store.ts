import { create } from 'zustand'

interface ModalState {
  isTransactionModalOpen: boolean
  openTransactionModal: () => void
  closeTransactionModal: () => void
  // Add Budget state
  isBudgetModalOpen: boolean
  openBudgetModal: () => void
  closeBudgetModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isTransactionModalOpen: false,
  openTransactionModal: () => set({ isTransactionModalOpen: true }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),
  // Budget implementations
  isBudgetModalOpen: false,
  openBudgetModal: () => set({ isBudgetModalOpen: true }),
  closeBudgetModal: () => set({ isBudgetModalOpen: false }),
}))