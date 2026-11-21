import { create } from 'zustand';

import { orders as initialOrders } from './constants';
import type { OrderRecord } from './types';

type OrdersState = {
  orders: OrderRecord[];
  cancelOrder: (id: string) => void;
};

/**
 * Orders live outside the tab component so cancelled orders survive the tab
 * (or screen) unmounting. Replace the initial data and `cancelOrder` with API
 * calls once the backend is wired up.
 */
export const useOrdersStore = create<OrdersState>((set) => ({
  orders: initialOrders,

  cancelOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status: 'cancelled' } : order,
      ),
    })),
}));
