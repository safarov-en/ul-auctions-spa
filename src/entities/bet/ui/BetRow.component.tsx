import React from 'react';
import type { BetItem } from '../../../shared/api/types/openapi';
import { Trophy, Ban } from 'lucide-react';

interface Props {
  bet: BetItem;
}

export const BetRow: React.FC<Props> = ({ bet }) => {
  return (
    <div
      className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        bet.is_win
          ? 'bg-amber-50/60 border-amber-300'
          : bet.is_rejected || bet.cancel_reason
          ? 'bg-red-50/50 border-red-200 opacity-75'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        {bet.place !== null && (
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              bet.place === 1
                ? 'bg-amber-500 text-white shadow-sm'
                : bet.place === 2
                ? 'bg-gray-300 text-gray-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {bet.place}
          </div>
        )}

        <div>
          <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            {bet.organization_name || 'Перевозчик'}
            {bet.is_win && (
              <span className="flex items-center gap-1 text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                <Trophy className="w-3 h-3" /> Победитель
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            ИНН: {bet.organization_inn} • {new Date(bet.created_at).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>

      <div className="flex items-end sm:items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
        <div className="text-right">
          <div className="font-extrabold text-sm text-gray-900">
            {bet.price_with_vat.toLocaleString('ru-RU')} ₽ <span className="text-[10px] font-normal text-gray-500">(с НДС)</span>
          </div>
          <div className="text-xs text-gray-500">
            {bet.price_no_vat.toLocaleString('ru-RU')} ₽ (без НДС)
          </div>
        </div>

        {bet.cancel_reason && (
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
            <Ban className="w-3.5 h-3.5" /> {bet.cancel_reason}
          </div>
        )}
      </div>
    </div>
  );
};