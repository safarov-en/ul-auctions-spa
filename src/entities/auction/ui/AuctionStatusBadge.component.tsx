import React from 'react';
import type { AuctionStatus, TradingStatus } from '../../../shared/api/types/openapi';

interface Props {
  status: AuctionStatus;
  statusMobile?: TradingStatus;
}

export const AuctionStatusBadge: React.FC<Props> = ({ status, statusMobile }) => {
  const getTradingStatusBadge = () => {
    switch (statusMobile) {
      case 'Leading':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Лидируете
          </span>
        );
      case 'Losing':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            Перебит
          </span>
        );
      case 'Winner':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Победитель
          </span>
        );
      default:
        return null;
    }
  };

  const getAuctionStatusBadge = () => {
    switch (status) {
      case 'Auction':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Торги идут
          </span>
        );
      case 'Finished':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            Завершён
          </span>
        );
      case 'DeterminateWinner':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Определение победителя
          </span>
        );
      case 'Canceled':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Отменён
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {getAuctionStatusBadge()}
      {getTradingStatusBadge()}
    </div>
  );
};