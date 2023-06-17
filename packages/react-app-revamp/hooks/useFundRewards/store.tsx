import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

export type Reward = {
  address: string;
  amount: string;
};

interface FundRewardsState {
  isLoading: boolean;
  error: CustomError | null;
  isSuccess: boolean;
  transactionData: any;
  rewards: Reward[];
  isModalOpen: boolean;
  validationError: { tokenAddress?: string; amount?: string }[];
  cancel: boolean;
  setValidationError: (validationError: { tokenAddress?: string; amount?: string }[]) => void;
  setRewards: (reward: Reward[]) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setCancel: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: CustomError | null) => void;
  setTransactionData: (data: any) => void;
}

export const createFundRewardsStore = () =>
  createStore<FundRewardsState>(set => ({
    isLoading: false,
    error: null,
    rewards: [],
    cancel: false,
    isSuccess: false,
    transactionData: null,
    isModalOpen: false,
    validationError: [],
    setValidationError: errors => set({ validationError: errors }),
    setRewards: rewards => set({ rewards: rewards }),
    setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setCancel: value => set({ cancel: value }),
    setError: value => set({ error: value }),
    setTransactionData: data => set({ transactionData: data }),
  }));

export const FundRewardsContext = createContext<ReturnType<typeof createFundRewardsStore> | null>(null);

export function FundRewardsWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createFundRewardsStore>>();
  if (!storeRef.current) {
    storeRef.current = createFundRewardsStore();
  }
  return <FundRewardsContext.Provider value={storeRef.current}>{children}</FundRewardsContext.Provider>;
}

export function useFundRewardsStore<T>(selector: (state: FundRewardsState) => T) {
  const store = useContext(FundRewardsContext);
  if (store === null) {
    throw new Error("Missing FundRewardsWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
