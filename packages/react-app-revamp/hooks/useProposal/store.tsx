import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

export interface ProposalCore {
  id: string;
  author: string;
  description: string;
  exists: boolean;
  rank: number;
  isTied: boolean;
  netVotes: number;
  isContentImage: boolean;
}

interface ProposalState {
  initialListProposalsIds: string[];
  listProposalsIds: string[];
  listProposalsData: ProposalCore[];
  isListProposalsLoading: boolean;
  isListProposalsSuccess: boolean;
  isListProposalsError: string;
  isPageProposalsLoading: boolean;
  isPageProposalsError: string;
  isPageProposalSuccess: boolean;
  indexPaginationProposals: Array<any[]>;
  totalPagesPaginationProposals: number;
  currentPagePaginationProposals: number;
  hasPaginationProposalsNextPage: boolean;
  canUpdateVotesInRealTime: boolean;
  submissionsCount: number;
  addProposalId: (id: string) => void;
  setInitialListProposalsIds: (list: string[]) => void;
  setListProposalsIds: (list: string[]) => void;
  setIsListProposalsLoading: (value: boolean) => void;
  setIsListProposalsSuccess: (value: boolean) => void;
  setIsListProposalsError: (value: string) => void;
  setProposalData: (proposals: ProposalCore[]) => void;
  setSubmissionsCount: (value: number) => void;
  setIsPageProposalsLoading: (value: boolean) => void;
  setIsPageProposalsError: (value: string) => void;
  setIsPageProposalsSuccess: (value: boolean) => void;
  setIndexPaginationProposalPerId: (proposals: any[]) => void;
  setTotalPagesPaginationProposals: (value: number) => void;
  setCurrentPagePaginationProposals: (value: number) => void;
  setHasPaginationProposalsNextPage: (value: boolean) => void;
  setCanUpdateVotesInRealTime: (value: boolean) => void;
}

export const createProposalStore = () =>
  createStore<ProposalState>(set => ({
    initialListProposalsIds: [],
    listProposalsIds: [],
    listProposalsData: [],
    isListProposalsLoading: false,
    isListProposalsSuccess: false,
    isListProposalsError: "",
    isPageProposalsLoading: false,
    isPageProposalsError: "",
    isPageProposalSuccess: false,
    indexPaginationProposals: [],
    totalPagesPaginationProposals: 0,
    currentPagePaginationProposals: 0,
    hasPaginationProposalsNextPage: false,
    canUpdateVotesInRealTime: false,
    submissionsCount: 0,
    setSubmissionsCount: value => set({ submissionsCount: value }),
    setIsPageProposalsLoading: value => set({ isPageProposalsLoading: value }),
    setIsPageProposalsSuccess: value => set({ isPageProposalSuccess: value }),
    setIsPageProposalsError: value => set({ isPageProposalsError: value }),
    setCurrentPagePaginationProposals: currentPage =>
      set({
        currentPagePaginationProposals: currentPage,
      }),
    setIndexPaginationProposalPerId: proposalsPages =>
      set({
        indexPaginationProposals: proposalsPages,
      }),
    setTotalPagesPaginationProposals: newTotal => set({ totalPagesPaginationProposals: newTotal }),
    setHasPaginationProposalsNextPage: hasNextPage => set({ hasPaginationProposalsNextPage: hasNextPage }),
    addProposalId: id => set(state => ({ listProposalsIds: [...state.listProposalsIds, id] })),
    setCanUpdateVotesInRealTime: value => set({ canUpdateVotesInRealTime: value }),
    setIsListProposalsLoading: value => set({ isListProposalsLoading: value }),
    setIsListProposalsError: value => set({ isListProposalsError: value }),
    setIsListProposalsSuccess: value => set({ isListProposalsSuccess: value }),
    setListProposalsIds: list => set({ listProposalsIds: list }),
    setInitialListProposalsIds: list => set({ initialListProposalsIds: list }),
    setProposalData: proposals => set({ listProposalsData: proposals }),
  }));

export const ProposalContext = createContext<ReturnType<typeof createProposalStore> | null>(null);

export function ProposalWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createProposalStore>>();
  if (!storeRef.current) {
    storeRef.current = createProposalStore();
  }
  return <ProposalContext.Provider value={storeRef.current}>{children}</ProposalContext.Provider>;
}

export function useProposalStore<T>(selector: (state: ProposalState) => T) {
  const store = useContext(ProposalContext);
  if (store === null) {
    throw new Error("Missing ProposalWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
