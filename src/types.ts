export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  lat: number;
  lng: number;
  created_at: string;
}
