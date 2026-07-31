import React from 'react';
import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { AuctionListItem } from '../../../shared/api/types/openapi';
import { AuctionStatusBadge } from '../../../entities/auction/ui/AuctionStatusBadge.component';
import { auctionKeys } from '../../../entities/auction/api/auctionQueries';
import { fetchApi } from '../../../shared/api/httpClient';
import { Button } from '../../../shared/ui/Button.component';
import { MapPin, ArrowRight, Truck, Calendar, ShieldCheck } from 'lucide-react';

interface Props {
  auction: AuctionListItem;
}

export const AuctionCard: React.FC<Props> = ({ auction }) => {
  const queryClient = useQueryClient();
  const uuid = auction.main.order_uid;

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: auctionKeys.detail(uuid),
      queryFn: () => fetchApi(`/api/v1/auctions/${uuid}`),
      staleTime: 1000 * 60 * 2,
    });
  };

  const currentPrice = auction.trading.price?.current;
  const pricePerKm = auction.main.price_per_km;
  const hasMyBet = auction.trading.your?.bet;

  const renderActionButton = () => {
    if (!auction.trading.can_set_bet) {
      return (
        <Button variant="secondary" size="sm" disabled>
          Ставки недоступны
        </Button>
      );
    }

    if (hasMyBet) {
      return (
        <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid: uuid }}>
          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            Изменить ставку
          </Button>
        </Link>
      );
    }

    return (
      <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid: uuid }}>
        <Button variant="primary" size="sm">
          Сделать ставку
        </Button>
      </Link>
    );
  };

  return (
    <div
      onMouseEnter={handlePrefetch}
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-base">№ {auction.main.cargo_num}</span>
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded font-medium">
            {auction.main.auc_type}
          </span>
          {hasMyBet && (
            <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Моя ставка
            </span>
          )}
        </div>
        <AuctionStatusBadge status={auction.trading.status} statusMobile={auction.trading.status_mobile} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm text-gray-900">{auction.route.load?.city || '—'}</div>
            <div className="text-xs text-gray-500">{auction.route.load?.address}</div>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block flex-shrink-0" />

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm text-gray-900">{auction.route.unload?.city || '—'}</div>
            <div className="text-xs text-gray-500">{auction.route.unload?.address}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-gray-400" />
          <span>
            {auction.cargo.name} ({auction.cargo.body_type})
          </span>
        </div>
        <div>
          Вес: <span className="font-medium text-gray-900">{auction.cargo.weight} т</span> / Объём:{' '}
          <span className="font-medium text-gray-900">{auction.cargo.volume} м³</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Загрузка: {new Date(auction.route.load?.date || '').toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-1">
        <div>
          <div className="text-xs text-gray-500">Текущая цена</div>
          <div className="text-lg font-extrabold text-gray-900">
            {currentPrice ? `${currentPrice.toLocaleString('ru-RU')} ₽` : 'Не задана'}
            {pricePerKm && <span className="text-xs font-normal text-gray-500 ml-2">({pricePerKm} ₽/км)</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/auctions/$auctionUuid" params={{ auctionUuid: uuid }}>
            <Button variant="outline" size="sm">
              Подробнее
            </Button>
          </Link>
          {renderActionButton()}
        </div>
      </div>
    </div>
  );
};