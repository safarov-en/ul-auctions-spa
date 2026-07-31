import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../../shared/api/httpClient';
import type {
    AuctionListRequest,
    AuctionListResponseBase,
    AuctionShowResponse,
    SetBetRequest,
} from '../../../shared/api/types/openapi';
export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionListRequest) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...auctionKeys.details(), uuid] as const,
};
export function useAuctionList(filters: AuctionListRequest) {
  return useQuery({
    queryKey: auctionKeys.list(filters),
    queryFn: () =>
      fetchApi<AuctionListResponseBase>('/api/v1/auctions/list', {
        method: 'POST',
        body: JSON.stringify(filters),
      }),
  });
}
export function useAuctionDetail(auctionUuid: string) {
  return useQuery({
    queryKey: auctionKeys.detail(auctionUuid),
    queryFn: () => fetchApi<AuctionShowResponse>(`/api/v1/auctions/${auctionUuid}`),
    enabled: Boolean(auctionUuid),
  });
}
export function usePlaceBetMutation(auctionUuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetBetRequest) =>
      fetchApi<{ message: string }>(`/api/v1/auctions/${auctionUuid}/bets`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.all });
    },
  });
}