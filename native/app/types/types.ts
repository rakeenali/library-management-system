import React from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { IBook, User, RentState, PaymentDetails } from './interface';

type Error = { error: string; status_code: number };
type ErrorResponse = AxiosError<Error>;

type Success = { message: string; status_code: number };
type SuccessMessage = AxiosResponse<Success>;

type Token = { token: string; status_code: number };
type TokenResponse = AxiosResponse<Token>;

type BookResponse = AxiosResponse<IBook[]>;

type UserResponse = AxiosResponse<User>;

type BookRentResponse = AxiosResponse<RentState>;

type PaymentResponse = AxiosResponse<PaymentDetails[]>;

type Dispatch<T> = (action: T) => void;

type ContextProps = { children: React.ReactNode };

export {
  ErrorResponse,
  SuccessMessage,
  Dispatch,
  ContextProps,
  TokenResponse,
  BookResponse,
  UserResponse,
  BookRentResponse,
  PaymentResponse
};
