import React from 'react';
import { View, Text } from 'react-native';
import axios, { AxiosResponse } from 'axios';

import Loader from '../components/Loader';
import BookCard from '../components/Book';

import { api } from '../utils/getVars';
import { IBook, ErrorResponse } from '../types';

enum LOADGING_STATE {
  'LOADING',
  'BOOK',
  'ERROR'
}

const Book = props => {
  const { isbn } = props.navigation.state.params;
  const [book, setBook] = React.useState<IBook | null>(null);
  const [loadingState, setLoadingState] = React.useState<LOADGING_STATE>(
    LOADGING_STATE.LOADING
  );
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    axios
      .get(`${api}/book/${isbn}`)
      .then((res: AxiosResponse<IBook>) => {
        if (res && res.data) {
          setBook(res.data);
          setLoadingState(LOADGING_STATE.BOOK);
        }
      })
      .catch((err: ErrorResponse) => {
        setLoadingState(LOADGING_STATE.ERROR);
        if (err && err.response) {
          setMessage(err.response.data.error);
        }
        throw new Error(err.message);
      });
  }, [isbn]);

  if (loadingState === LOADGING_STATE.LOADING) {
    return <Loader />;
  } else if (loadingState === LOADGING_STATE.BOOK) {
    return <BookCard {...props} book={book} />;
  } else if (loadingState === LOADGING_STATE.ERROR) {
    return (
      <View>
        <Text>{message}</Text>
      </View>
    );
  }

  return <></>;
};

export default Book;
