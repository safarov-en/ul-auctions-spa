import React from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useAuctionDetail } from '../../../entities/auction/api/auctionQueries';
import { PlaceBetForm } from '../../../features/place-bet/ui/PlaceBetForm.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { ArrowLeft, Gavel } from 'lucide-react';

export const AuctionPlaceBetPage: React.FC = () => {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bet' });
  const navigate = useNavigate();
  const { data: auction, isLoading } = useAuctionDetail(auctionUuid);

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <Link
        to="/auctions/$auctionUuid"
        params={{ auctionUuid }}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к аукциону
      </Link>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">Установка ставки</h1>
            <p className="text-xs text-gray-500">Заявка № {auction?.main.cargo_num || '...'}</p>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : !auction?.trading.can_set_bet ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 text-center">
            Торги по данному аукциону закрыты или недоступны для вашего аккаунта.
          </div>
        ) : (
          <PlaceBetForm
            auctionUuid={auctionUuid}
            priceInfo={auction.trading.price}
            onSuccess={() => navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } })}
          />
        )}
      </div>
    </div>
  );
};