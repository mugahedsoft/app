import { CartItem, CustomerInfo } from '../types';

const CART_KEY = 'pizzeti_cart';
const CUSTOMER_KEY = 'pizzeti_customer';

export const storage = {
  getCart(): CartItem[] {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  },

  getCustomer(): CustomerInfo | null {
    const data = localStorage.getItem(CUSTOMER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveCustomer(customer: CustomerInfo): void {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  }
};
