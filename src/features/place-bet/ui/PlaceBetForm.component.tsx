import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBetSchema, type BetFormData } from '../model/betSchema';
import { usePlaceBetMutation } from '../../../entities/auction/api/auctionQueries';
import type { AuctionShowTradingPrice } from '../../../shared/api/types/openapi';
import { Input } from '../../../shared/ui/Input.component';
import { Button } from '../../../shared/ui/Button.component';
import { Toast } from '../../../shared/ui/Toast.component';
import { ApiError } from '../../../shared/api/httpClient';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  auctionUuid: string;
  priceInfo?: AuctionShowTradingPrice;
  onSuccess?: () => void;
}

export const PlaceBetForm: React.FC<Props> = ({ auctionUuid, priceInfo, onSuccess }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [toastState, setToastState] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const placeBetMutation = usePlaceBetMutation(auctionUuid);
  const minAllowedPrice = priceInfo?.min || 1;
  const currentBetSchema = createBetSchema(minAllowedPrice);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BetFormData>({
    resolver: zodResolver(currentBetSchema),
    defaultValues: {
      price: priceInfo?.available || priceInfo?.current || undefined,
    },
  });

  const onSubmit = (data: BetFormData) => {
    setServerError(null);
    placeBetMutation.mutate(
      { price: data.price },
      {
        onSuccess: () => {
          setToastState({
            isOpen: true,
            message: 'Ставка успешно принята!',
            type: 'success',
          });
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.details.message : 'Ошибка при отправке ставки.';
          setServerError(message);
          setToastState({
            isOpen: true,
            message,
            type: 'error',
          });
        },
      }
    );
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (toastState.isOpen && toastState.type === 'success' && onSuccess) {
      timer = setTimeout(onSuccess, 1500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [toastState.isOpen, toastState.type, onSuccess]);

  return (
    <>
      <Toast
        isOpen={toastState.isOpen}
        message={toastState.message}
        type={toastState.type}
        onClose={() => setToastState((prev) => ({ ...prev, isOpen: false }))}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {toastState.isOpen && toastState.type === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <h4 className="font-bold text-emerald-900 text-sm">Ставка успешно принята!</h4>
            <p className="text-xs text-emerald-700">Информация сохранена.</p>
          </div>
        ) : (
          <>
            {priceInfo && (
              <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-xs flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Текущая цена:</span>
                  <span className="font-bold text-gray-900">
                    {priceInfo.current?.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                {priceInfo.available && priceInfo.available > 0 && (
                  <div className="flex justify-between text-blue-800 font-semibold">
                    <span>Рекомендуемая ставка:</span>
                    <span>{priceInfo.available.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Минимальный порог:</span>
                  <span>{minAllowedPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                {priceInfo.step && (
                  <div className="flex justify-between text-gray-500">
                    <span>Минимальный шаг:</span>
                    <span>{priceInfo.step.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
              </div>
            )}

            <Input
              label="Ваша цена ставки (с НДС), ₽"
              type="number"
              placeholder="Введите сумму"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />

            {priceInfo?.available && priceInfo.available > 0 && (
              <button
                type="button"
                onClick={() => setValue('price', priceInfo.available!)}
                className="text-xs text-blue-600 hover:underline text-left font-medium"
              >
                Подставить рекомендуемую цену ({priceInfo.available.toLocaleString('ru-RU')} ₽)
              </button>
            )}

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={placeBetMutation.isPending}
            >
              Отправить ставку
            </Button>
          </>
        )}
      </form>
    </>
  );
};