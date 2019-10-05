import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';

import Loader from '../components/Loader';
import Book from '../components/Book';

import { useUserState } from '../context/User';
import { api } from '../utils/getVars';
import { IBook, BookResponse } from '../types';

enum COMPONENT_STATE {
  LOADING,
  LOADED,
  IDLE
}

const Books = props => {
  const [books, setBooks] = React.useState<IBook[]>([]);
  const [loading, setLoading] = React.useState<COMPONENT_STATE>(
    COMPONENT_STATE.LOADING
  );
  const userState = useUserState();
  const [refresh, setRefresh] = React.useState<boolean>(false);

  React.useEffect(() => {
    axios
      .get(`${api}/book`)
      .then((res: BookResponse) => {
        setLoading(COMPONENT_STATE.LOADED);
        if (res && res.data) {
          setRefresh(false);
          setBooks(res.data);
        }
      })
      .catch(err => {
        setLoading(COMPONENT_STATE.IDLE);
        throw new Error(err.message);
      });
  }, [userState.rentBooks, userState.isbns, refresh]);

  const onRefresh = () => {
    setRefresh(true);
  };

  if (loading === COMPONENT_STATE.LOADING) {
    return <Loader />;
  } else if (loading === COMPONENT_STATE.LOADED && books.length > 0) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {books.map(book => (
          <Book book={book} {...props} key={book.id} />
        ))}
      </ScrollView>
    );
  }
  return <></>;
};

export default Books;
