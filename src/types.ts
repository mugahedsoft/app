export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  orderType: 'delivery' | 'pickup';
  area: string;
  deliveryNotes: string;
}

export interface Order {
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  date: string;
  time: string;
}
