import { create } from 'zustand';
import { z } from 'zod';
import type { AuctionListRequest } from '../../../shared/api/types/openapi';

export const filterSchema = z.object({
  cargo_num: z.string().optional(),
  load_city: z.string().optional(),
  unload_city: z.string().optional(),
  auc_type: z.array(z.enum(['Request', 'Up', 'Down', 'FixPrice'])).optional(),
  status: z.array(z.string()).optional(),
  current_price_from: z.number().nullable().optional(),
  current_price_to: z.number().nullable().optional(),
  is_available: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20),
});

export type FilterState = z.infer<typeof filterSchema>;

interface FilterStore {
  filters: AuctionListRequest;
  setFilter: <K extends keyof AuctionListRequest>(key: K, value: AuctionListRequest[K]) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const DEFAULT_FILTERS: AuctionListRequest = {
  page: 1,
  per_page: 20,
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 }, 
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),
}));