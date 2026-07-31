import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../shared/api/httpClient';
import type { BetListResponse } from '../../../shared/api/types/openapi';

export const betKeys = {
  all: ['bets'] as const,
  byAuction: (uuid: string) => [...betKeys.all, uuid] as const,
};

export function useAuctionBets(auctionUuid: string, enabled: boolean = true) {
  return useQuery({
    queryKey: betKeys.byAuction(auctionUuid),
    queryFn: () => fetchApi<BetListResponse>(`/api/v1/auctions/${auctionUuid}/bets`),
    enabled: Boolean(auctionUuid) && enabled,
  });
}