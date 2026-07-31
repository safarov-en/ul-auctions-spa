import { http, HttpResponse } from 'msw';
import { mockDb } from './db';
import type {
  AuctionListRequest,
  AuctionListResponseBase,
  SetBetRequest,
  ValidationProblem,
  ProblemDetail,
} from '../api/types/openapi';

export const handlers = [
  http.post('/api/v1/auctions/list', async ({ request }) => {
    let body: AuctionListRequest = {};
    try {
      body = (await request.json()) as AuctionListRequest;
    } catch {
      //
    }
    let items = mockDb.getList();
    if (body.cargo_num) {
      const q = body.cargo_num.toLowerCase();
      items = items.filter((item) => item.main?.cargo_num?.toLowerCase().includes(q));
    }
    if (body.auc_type && body.auc_type.length > 0) {
      items = items.filter((item) =>
        item.main?.auc_type ? (body.auc_type as string[]).includes(item.main.auc_type) : false
      );
    }
    if (body.status && body.status.length > 0) {
      items = items.filter((item) =>
        item.trading?.status_mobile ? body.status?.includes(item.trading.status_mobile) : false
      );
    }
    if (body.load_city) {
      const city = body.load_city.toLowerCase();
      items = items.filter((item) => item.route?.load?.city?.toLowerCase().includes(city));
    }
    if (body.unload_city) {
      const city = body.unload_city.toLowerCase();
      items = items.filter((item) => item.route?.unload?.city?.toLowerCase().includes(city));
    }
    if (body.current_price_from !== undefined && body.current_price_from !== null) {
      items = items.filter((item) => (item.trading?.price?.current ?? 0) >= body.current_price_from!);
    }
    if (body.current_price_to !== undefined && body.current_price_to !== null) {
      items = items.filter((item) => (item.trading?.price?.current ?? 0) <= body.current_price_to!);
    }
    if (body.is_available) {
      items = items.filter((item) => Boolean(item.trading?.is_available));
    }
    if (body.is_bidder) {
      items = items.filter((item) => Boolean(item.trading?.is_bidder));
    }
    const page = body.page || 1;
    const perPage = body.per_page || 20;
    const total = items.length;
    const paginatedItems = items.slice((page - 1) * perPage, page * perPage);
    const response: AuctionListResponseBase = {
      data: paginatedItems,
      meta: {
        current_page: page,
        from: total > 0 ? (page - 1) * perPage + 1 : 0,
        last_page: Math.ceil(total / perPage) || 1,
        per_page: perPage,
        to: Math.min(page * perPage, total),
        total,
      },
    };
    return HttpResponse.json(response, { status: 200 });
  }),

  http.get('/api/v1/auctions/:auctionUuid/bets', ({ params }) => {
    const { auctionUuid } = params;
    const bets = mockDb.getBets(String(auctionUuid));
    if (!bets) {
      const errorResponse: ProblemDetail = {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: 'Аукцион не найден',
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }
    return HttpResponse.json({ bets }, { status: 200 });
  }),

  http.post('/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const { auctionUuid } = params;
    const auction = mockDb.getByUuid(String(auctionUuid));
    if (!auction) {
      const errorResponse: ProblemDetail = {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: 'Аукцион не найден',
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }
    let body: SetBetRequest;
    try {
      body = (await request.json()) as SetBetRequest;
    } catch {
      const validationError: ValidationProblem = {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Некорректное тело запроса',
        errors: [{ field: 'price', message: 'Обязательное поле' }],
      };
      return HttpResponse.json(validationError, { status: 422 });
    }
    if (!body.price || body.price <= 0) {
      const validationError: ValidationProblem = {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        errors: [{ field: 'price', message: 'Цена должна быть больше 0.' }],
      };
      return HttpResponse.json(validationError, { status: 422 });
    }
    try {
      mockDb.addBet(String(auctionUuid), body.price);
      return HttpResponse.json({ message: 'Ставка принята' }, { status: 200 });
    } catch {
      const errorResponse: ProblemDetail = {
        code: 'service_unavailable',
        title: 'Ошибка сервера',
        message: 'Не удалось сохранить ставку',
      };
      return HttpResponse.json(errorResponse, { status: 503 });
    }
  }),

  http.get('/api/v1/auctions/:auctionUuid', ({ params }) => {
    const { auctionUuid } = params;
    const auction = mockDb.getByUuid(String(auctionUuid));
    if (!auction) {
      const errorResponse: ProblemDetail = {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: 'Аукцион не найден',
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }
    return HttpResponse.json(auction, { status: 200 });
  }),
];