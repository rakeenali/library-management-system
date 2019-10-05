export interface IBook {
  id: number;
  title: string;
  description: string;
  quantity: string;
  isbn: string;
  added_by: string;
  rent_price: number;
  book_image: string;
}

export interface RentBook {
  isbn: string;
  rent_id?: number;
  rent_price: number;
  rented_on?: string;
  description: string;
  id: number;
  title: string;
  book_image: string;
}

export interface User {
  id: string;
  username: string;
  books: RentBook[];
}

export interface RentState {
  fine_amount: number;
  is_late: boolean;
  payment: number;
  status_code: number;
  time_left: string;
}

export interface PaymentDetails {
  title: string;
  payment_made_at: string;
  username: string;
  id: number;
  amount: number;
}

export enum COMPONENT_STATE {
  LOADING,
  LOADED,
  IDLE
}
