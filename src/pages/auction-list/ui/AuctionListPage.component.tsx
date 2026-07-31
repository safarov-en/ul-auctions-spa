import React from 'react';
import { useAuctionList } from '../../../entities/auction/api/auctionQueries';
import { useFilterStore } from '../../../features/filter-auctions/model/useFilterStore';
import { AuctionFilters } from '../../../features/filter-auctions/ui/AuctionFilters.component';
import { AuctionCard } from '../../../widgets/auction-card/ui/AuctionCard.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { Button } from '../../../shared/ui/Button.component';
import { AlertCircle, Inbox } from 'lucide-react';

export const AuctionListPage: React.FC = () => {
  const { filters, setPage } = useFilterStore();
  const { data, isLoading, isError, refetch } = useAuctionList(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Список грузовых аукционов</h1>
        <p className="text-sm text-gray-500 mt-1">
          Актуальные торги и заявки на перевозки по всей России
        </p>
      </div>
      <AuctionFilters />
      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 border border-gray-200 bg-white rounded-xl flex flex-col gap-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}
      {isError && (
        <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-600" />
          <h3 className="text-base font-bold text-red-900">Не удалось загрузить аукционы</h3>
          <p className="text-xs text-red-700">Произошла ошибка при обращении к серверу.</p>
          <Button variant="danger" size="sm" onClick={() => refetch()}>
            Повторить попытку
          </Button>
        </div>
      )}
      {!isLoading && !isError && data?.data.length === 0 && (
        <div className="p-12 bg-white border border-gray-200 rounded-xl text-center flex flex-col items-center gap-3">
          <Inbox className="w-12 h-12 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-800">Аукционы не найдены</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            По выбранным фильтрам нет подходящих предложений. Попробуйте изменить параметры поиска.
          </p>
        </div>
      )}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.data.map((auction) => (
            <AuctionCard key={auction.main.order_uid} auction={auction} />
          ))}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mt-2">
            <span className="text-xs text-gray-500">
              Показано {data.meta.from}–{data.meta.to} из {data.meta.total} аукционов
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.current_page <= 1}
                onClick={() => setPage(data.meta.current_page - 1)}
              >
                Назад
              </Button>
              <span className="text-xs font-semibold px-2">
                Стр. {data.meta.current_page} из {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.current_page >= data.meta.last_page}
                onClick={() => setPage(data.meta.current_page + 1)}
              >
                Вперёд
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};