import React from 'react';
import { useAuctionBets } from '../../../entities/bet/api/betQueries';
import { BetRow } from '../../../entities/bet/ui/BetRow.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { Users, History, Lock } from 'lucide-react';

interface Props {
  auctionUuid: string;
  hideBetsHistory?: boolean;
}

export const AuctionBetsHistory: React.FC<Props> = ({ auctionUuid, hideBetsHistory }) => {
  const { data, isLoading, isError } = useAuctionBets(auctionUuid, !hideBetsHistory);

  if (hideBetsHistory) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center flex flex-col items-center gap-2">
        <Lock className="w-8 h-8 text-amber-600" />
        <h4 className="font-bold text-amber-900 text-sm">История ставок скрыта</h4>
        <p className="text-xs text-amber-700">Организатор аукциона ограничил просмотр истории ставок для участников.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-xs text-red-600 bg-red-50 p-4 rounded-lg">Не удалось загрузить историю ставок.</div>;
  }

  const bets = data?.bets || [];
  const uniqueParticipants = new Set(bets.map((b) => b.organization_inn)).size;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
          <History className="w-5 h-5 text-blue-600" />
          <span>История ставок</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
          <Users className="w-3.5 h-3.5" />Участников: {uniqueParticipants}
        </div>
      </div>

      {bets.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-500">Ставок пока нет. Будьте первым!</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {bets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
        </div>
      )}
    </div>
  );
};