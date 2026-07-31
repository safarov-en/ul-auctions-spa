import type { AuctionShowResponse, BetItem, AuctionListItem } from '../api/types/openapi';
import { INITIAL_AUCTIONS, type AuctionRecord } from './data/initialAuctions';

class MockAuctionStore {
  private auctions: AuctionRecord[] = INITIAL_AUCTIONS;

  public getList(): AuctionListItem[] {
    return this.auctions.map((auc) => ({
      main: {
        id: auc.showData.main.id,
        cargo_num: auc.showData.main.cargo_num,
        cargo_date: auc.showData.main.cargo_date,
        auc_type: auc.showData.main.auc_type,
        order_uid: auc.showData.main.order_uid,
        created_at: auc.showData.main.created_at,
        priority_sort: 0,
        is_assembly: false,
        price_per_km: auc.showData.trading?.price?.price_per_km ?? null,
      },
      organizer: {
        subscriber_id: auc.showData.organizer.subscriber_id,
        organization_id: auc.showData.organizer.organization_id,
        organization_name: auc.showData.organizer.organization_name,
        organization_inn: auc.showData.organizer.organization_inn,
        organization_kpp: auc.showData.organizer.organization_kpp,
        is_hide_organization: false,
      },
      route: {
        load: auc.showData.routes?.[0]
          ? {
              city: auc.showData.routes[0].location?.city_name ?? '',
              address: auc.showData.routes[0].location?.loading_address ?? '',
              date: auc.showData.routes[0].start_date ?? '',
              city_gc_id: auc.showData.routes[0].location?.city_gc_id ?? 0,
              points_count: 1,
            }
          : undefined,
        unload: auc.showData.routes?.[1]
          ? {
              city: auc.showData.routes[1].location?.city_name ?? '',
              address: auc.showData.routes[1].location?.loading_address ?? '',
              date: auc.showData.routes[1].start_date ?? '',
              city_gc_id: auc.showData.routes[1].location?.city_gc_id ?? 0,
              points_count: 1,
            }
          : undefined,
      },
      cargo: {
        name: auc.showData.cargo?.car?.type ?? 'Груз',
        weight: auc.showData.cargo?.car?.weight ?? 0,
        volume: auc.showData.cargo?.car?.volume ?? 0,
        body_type: auc.showData.cargo?.body_type ?? 'тентованный',
        truck_count: auc.showData.cargo?.truck_count ?? 1,
        is_cargo: true,
        is_international: auc.showData.cargo?.is_international ?? false,
        containered: auc.showData.cargo?.containered ?? false,
        incoterms: null,
        conics: auc.showData.cargo?.conics ?? null,
        belts: auc.showData.cargo?.belts ?? null,
        adr: auc.showData.cargo?.adr ?? null,
        coupling: auc.showData.cargo?.coupling ?? null,
        air_pass: auc.showData.cargo?.air_pass ?? null,
        low_loader: auc.showData.cargo?.low_loader ?? null,
        additional_load: auc.showData.cargo?.additional_load ?? null,
        temp_from: auc.showData.cargo?.temp_from ?? null,
        temp_to: auc.showData.cargo?.temp_to ?? null,
      },
      trading: {
        status: auc.showData.trading.status,
        status_mobile: auc.showData.trading.status_mobile,
        start_time: auc.showData.trading.start_time,
        stop_time: auc.showData.trading.stop_time,
        bid_measurement_type: auc.showData.trading.bid_measurement_type,
        can_set_bet: auc.showData.trading.can_set_bet,
        allow_counter_bets: auc.showData.trading.allow_counter_bets,
        hide_points_address_and_contacts: auc.showData.trading.hide_points_address_and_contacts,
        direction: null,
        comment: null,
        is_bidder: auc.showData.trading.is_bidder,
        is_available: auc.showData.trading.price?.current !== null,
        is_accredited: true,
        is_favorite: auc.showData.trading.is_favorite,
        price: {
          start: auc.showData.trading.price?.start,
          current: auc.showData.trading.price?.current,
          current_no_vat: auc.showData.trading.price?.current_no_vat,
        },
        your: {
          bet: auc.showData.trading.your?.bet ?? false,
          last_bet: auc.showData.trading.your?.last_bet ?? null,
        },
        red_bet_with_vat: auc.showData.trading.red_bet_with_vat,
        red_bet_no_vat: auc.showData.trading.red_bet_no_vat,
        is_last_bet_with_vat: auc.showData.trading.is_last_bet_with_vat,
      },
      payment: {
        form: auc.showData.payment.form,
        currency_code: auc.showData.payment.currency_code,
        consignor: null,
        consignee: null,
      },
    }));
  }

  public getByUuid(uuid: string): AuctionShowResponse | null {
    const found = this.auctions.find((a) => a.uuid === uuid || a.showData.main.order_uid === uuid);
    return found ? found.showData : null;
  }

  public getBets(uuid: string): BetItem[] | null {
    const found = this.auctions.find((a) => a.uuid === uuid || a.showData.main.order_uid === uuid);
    return found ? found.bets : null;
  }

  public addBet(uuid: string, price: number): BetItem {
    const auction = this.auctions.find((a) => a.uuid === uuid || a.showData.main.order_uid === uuid);
    if (!auction) throw new Error('Auction not found');

    const newBet: BetItem = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      auction_id: auction.showData.main.id,
      subscriber_id: 13,
      contact_name: 'Текущий Пользователь',
      contact_phone: '+79000000000',
      price_with_vat: price,
      price_no_vat: +(price / 1.2).toFixed(2),
      organization_id: 14,
      organization_inn: '9616244307',
      organization_name: 'Моя Компани ООО',
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: false,
      run_number: 0,
      cancel_reason: '',
      price_info: {
        price_with_vat: price,
        price_no_vat: +(price / 1.2).toFixed(2),
        payment_type: 'Безналичная с НДС',
        vat_rate: '20',
      },
    };

    auction.bets.forEach((b) => {
      if (b.place !== null) b.place += 1;
    });

    auction.bets.unshift(newBet);

    if (auction.showData.trading.price) {
      auction.showData.trading.price.current = price;
      auction.showData.trading.price.current_no_vat = +(price / 1.2).toFixed(2);

      const step = auction.showData.trading.price.step || 500;
      const minPrice = auction.showData.trading.price.min || 0;

      if (auction.showData.main.auc_type === 'Down') {
        auction.showData.trading.price.available = Math.max(minPrice, price - step);
      } else {
        auction.showData.trading.price.available = price + step;
      }
    }

    auction.showData.trading.status_mobile = 'Leading';
    auction.showData.trading.is_bidder = true;
    auction.showData.trading.your = {
      bet: true,
      last_bet: price,
      last_bet_with_vat: price,
      win: false,
    };

    return newBet;
  }
}

export const mockDb = new MockAuctionStore();