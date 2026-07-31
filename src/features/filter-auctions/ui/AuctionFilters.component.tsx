import React from 'react';
import { useFilterStore } from '../model/useFilterStore';
import { MOCK_CITIES } from '../../../shared/mocks/data/cities';
import { Input } from '../../../shared/ui/Input.component';
import { Button } from '../../../shared/ui/Button.component';
import { RotateCcw, Filter } from 'lucide-react';

export const AuctionFilters: React.FC = () => {
  const { filters, setFilter, resetFilters } = useFilterStore();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>Фильтры аукционов</span>
        </div>
        <Button variant="outline" size="sm" onClick={resetFilters} className="text-gray-600">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Сбросить
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Номер заявки"
          placeholder="Например, 00000001059"
          value={filters.cargo_num || ''}
          onChange={(e) => setFilter('cargo_num', e.target.value || undefined)}
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-700">Город погрузки</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={filters.load_city || ''}
            onChange={(e) => setFilter('load_city', e.target.value || undefined)}
          >
            <option value="">Все города</option>
            {MOCK_CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-700">Город выгрузки</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={filters.unload_city || ''}
            onChange={(e) => setFilter('unload_city', e.target.value || undefined)}
          >
            <option value="">Все города</option>
            {MOCK_CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-700">Тип аукциона</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={filters.auc_type?.[0] || ''}
            onChange={(e) =>
              setFilter(
                'auc_type',
                e.target.value ? [e.target.value as 'Request' | 'Up' | 'Down' | 'FixPrice'] : undefined
              )
            }
          >
            <option value="">Все типы</option>
            <option value="Down">Down (на понижение)</option>
            <option value="Up">Up (на повышение)</option>
            <option value="Request">Request (заявочный)</option>
            <option value="FixPrice">FixPrice (фиксированная цена)</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-gray-700 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={Boolean(filters.is_available)}
            onChange={(e) => setFilter('is_available', e.target.checked || undefined)}
          />
          <span>Только доступные для ставок</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={Boolean(filters.is_bidder)}
            onChange={(e) => setFilter('is_bidder', e.target.checked || undefined)}
          />
          <span>Только с моим участием</span>
        </label>
      </div>
    </div>
  );
};