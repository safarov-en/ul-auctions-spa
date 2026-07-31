import React from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { useAuctionDetail } from '../../../entities/auction/api/auctionQueries';
import { AuctionStatusBadge } from '../../../entities/auction/ui/AuctionStatusBadge.component';
import { AuctionDetailView } from '../../../widgets/auction-detail-view/ui/AuctionDetailView.component';
import { AuctionBetsHistory } from '../../../widgets/auction-bets-history/ui/AuctionBetsHistory.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { Button } from '../../../shared/ui/Button.component';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const AuctionDetailPage: React.FC = () => {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });
  const { data: auction, isLoading, isError } = useAuctionDetail(auctionUuid);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center flex flex-col items-center gap-3">
        <AlertTriangle className="w-10 h-10 text-red-600" />
        <h3 className="text-base font-bold text-red-900">Аукцион не найден</h3>
        <Link to="/">
          <Button variant="outline" size="sm">
            Вернуться к списку
          </Button>
        </Link>
      </div>
    );
  }

  const { main, trading } = auction;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-4 h-4" /> К списку аукционов
      </Link>
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">Заявка № {main.cargo_num}</h1>
            <span className="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-700 font-semibold rounded">
              {main.auc_type}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Создан: {new Date(main.created_at).toLocaleString('ru-RU')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AuctionStatusBadge status={trading.status} statusMobile={trading.status_mobile} />
          {trading.can_set_bet && (
            <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }}>
              <Button variant="primary" size="md">
                Сделать ставку
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AuctionDetailView auction={auction} />
          <AuctionBetsHistory auctionUuid={auctionUuid} hideBetsHistory={trading.hide_bets_history} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-4 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Параметры торга</h3>
            {trading.no_view_cargo_price ? (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                Цена груза скрыта заказчиком
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-xs text-gray-500">Текущая цена:</span>
                  <div className="text-2xl font-black text-gray-900">
                    {trading.price?.current ? `${trading.price.current.toLocaleString('ru-RU')} ₽` : '—'}
                  </div>
                </div>

                {trading.price?.available && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 font-medium">
                    Доступная ставка: <span className="font-bold">{trading.price.available.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div>Шаг: {trading.price?.step ? `${trading.price.step} ₽` : '—'}</div>
                  <div>Мин: {trading.price?.min ? `${trading.price.min} ₽` : '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};