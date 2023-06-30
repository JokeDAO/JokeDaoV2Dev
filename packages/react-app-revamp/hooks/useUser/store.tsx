import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

interface UserState {
  currentUserQualifiedToSubmit: boolean;
  currentUserQualifiedToVote: boolean;
  currentUserTotalVotesAmount: number;
  currentUserAvailableVotesAmount: number;
  contestMaxNumberSubmissionsPerUser: number;
  currentUserProposalCount: number;

  isLoading: boolean;
  isSuccess: boolean;
  error: CustomError | null;

  setCurrentUserQualifiedToSubmit: (value: boolean) => void;
  setCurrentUserQualifiedToVote: (value: boolean) => void;
  setCurrentUserAvailableVotesAmount: (amount: number) => void;
  setCurrentUserTotalVotesAmount: (amount: number) => void;
  setContestMaxNumberSubmissionsPerUser: (amount: number) => void;
  setCurrentUserProposalCount: (amount: number) => void;
  increaseCurrentUserProposalCount: () => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: CustomError | null) => void;
}

export const createUserStore = () =>
  createStore<UserState>(set => ({
    currentUserQualifiedToSubmit: false,
    currentUserQualifiedToVote: false,
    currentUserAvailableVotesAmount: 0,
    currentUserTotalVotesAmount: 0,
    contestMaxNumberSubmissionsPerUser: 0,
    currentUserProposalCount: 0,
    isLoading: false,
    isSuccess: false,
    error: null,

    setCurrentUserQualifiedToSubmit: value => set({ currentUserQualifiedToSubmit: value }),
    setCurrentUserQualifiedToVote: value => set({ currentUserQualifiedToVote: value }),
    setCurrentUserAvailableVotesAmount: amount => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesAmount: amount => set({ currentUserTotalVotesAmount: amount }),
    setContestMaxNumberSubmissionsPerUser: amount => set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserProposalCount: amount => set({ currentUserProposalCount: amount }),

    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setError: value => set({ error: value }),
  }));

export const UserContext = createContext<ReturnType<typeof createUserStore> | null>(null);

export function UserWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createUserStore>>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }
  return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>;
}

export function useUserStore<T>(selector: (state: UserState) => T) {
  const store = useContext(UserContext);
  if (store === null) {
    throw new Error("Missing UserWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
