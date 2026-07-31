import React from 'react';
import type { AuctionShowResponse } from '../../../shared/api/types/openapi';
import { MapPin, Truck, Building, CreditCard, Clock } from 'lucide-react';

interface Props {
  auction: AuctionShowResponse;
}

export const AuctionDetailView: React.FC<Props> = ({ auction }) => {
  const { organizer, cargo, payment, routes, trading } = auction;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> Маршрут перевозки
        </h3>
        <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-blue-200">
          {routes.map((point) => (
            <div key={point.row_num} className="relative flex flex-col gap-1">
              <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
              <div className="font-semibold text-sm text-gray-900">
                {point.op_type === 'Loading' ? 'Погрузка' : 'Выгрузка'}: {point.location?.city_name}
              </div>
              <div className="text-xs text-gray-600">
                {trading.hide_points_address_and_contacts
                  ? 'Адрес скрыт до сделки'
                  : point.location?.loading_address}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {new Date(point.start_date).toLocaleString('ru-RU')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" /> Характеристики груза
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block">Тип кузова</span>
            <span className="font-semibold text-gray-900">{cargo.body_type}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Количество ТС</span>
            <span className="font-semibold text-gray-900">{cargo.truck_count} шт</span>
          </div>
          <div>
            <span className="text-gray-500 block">Дистанция</span>
            <span className="font-semibold text-gray-900">
              {cargo.distance ? `${cargo.distance} км` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-2 text-xs">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-blue-600" /> Организатор
          </h3>
          <div className="font-bold text-gray-900 text-sm">{organizer.organization_name}</div>
          <div className="text-gray-500">ИНН: {organizer.organization_inn}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-2 text-xs">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-blue-600" /> Оплата
          </h3>
          <div>Форма: <span className="font-semibold text-gray-900">{payment.form}</span></div>
          <div>Условие: <span className="text-gray-700">{payment.condition}</span></div>
        </div>
      </div>
    </div>
  );
};