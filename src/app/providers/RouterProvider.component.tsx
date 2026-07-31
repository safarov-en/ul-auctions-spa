import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { AuctionListPage } from '../../pages/auction-list/ui/AuctionListPage.component';
import { AuctionDetailPage } from '../../pages/auction-detail/ui/AuctionDetailPage.component';
import { AuctionPlaceBetPage } from '../../pages/auction-place-bet/ui/AuctionPlaceBetPage.component';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-blue-700 transition-colors">
              UL
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 block leading-none">Умная Логистика</span>
              <span className="text-xs text-gray-500">Грузовые аукционы</span>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuctionListPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  component: AuctionDetailPage,
});

const placeBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bet',
  component: AuctionPlaceBetPage,
});

const routeTree = rootRoute.addChildren([indexRoute, detailRoute, placeBetRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RouterProviderApp: React.FC = () => {
  return <RouterProvider router={router} />;
};