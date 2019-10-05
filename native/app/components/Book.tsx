import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import axios from 'axios';

import { useUserState, useUserDispatch } from '../context/User';
import { useAlertDispatch } from '../context/Alert';
import { api } from '../utils/getVars';
import { IBook, ErrorResponse, SuccessMessage } from '../types';

interface Props {
  book: IBook;
  navigation?: {
    navigate: Function;
    state: {
      routeName: string;
    };
  };
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: '100%',
    marginVertical: 5
  },
  description: {
    marginVertical: 10,
    lineHeight: 1.6
  },
  cta: {
    marginVertical: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  ctaText: {
    color: 'red'
  },
  buttonArea: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});

const Book = (props: Props): JSX.Element => {
  const { book } = props;
  const { routeName } = props.navigation.state;

  const { token, isbns } = useUserState();
  const alertDispatch = useAlertDispatch();
  const userDispatch = useUserDispatch();

  const [loadingRent, setLoadingRent] = React.useState<boolean>(false);

  const goToDetails = () => {
    props.navigation.navigate('Book', { isbn: book.isbn });
  };

  const rentBook = () => {
    setLoadingRent(true);
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios
      .post(`${api}/user/rent-book/${book.isbn}`, {}, { headers })
      .then((res: SuccessMessage) => {
        if (res && res.data) {
          setLoadingRent(false);
          props.navigation.navigate('Rent');
          userDispatch({ type: 'ADD_BOOK', payload: book });
          alertDispatch({ type: 'SHOW_ALERT', payload: res.data.message });
        }
      })
      .catch((err: ErrorResponse) => {
        throw new Error(err.message);
      });
  };

  const returnBook = () => {
    props.navigation.navigate('BookReturn', { isbn: book.isbn });
    return;
  };

  const buttonType = (): JSX.Element => {
    if (isbns.length > 0 && isbns.includes(book.isbn)) {
      return (
        <Button
          title="Return"
          type="outline"
          buttonStyle={{ width: '80%' }}
          onPress={returnBook}
        />
      );
    }
    return (
      <Button
        title="Rent"
        type="outline"
        buttonStyle={{ width: '80%' }}
        onPress={rentBook}
        loading={loadingRent}
      />
    );
  };

  return (
    <Card title={book.title}>
      <View>
        <Image source={{ uri: book.book_image }} style={styles.image} />
        <Text>{book.description}</Text>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>Rent Price: {book.rent_price}</Text>
        <Text style={styles.ctaText}>Quantity Left: {book.quantity}</Text>
      </View>
      <View style={styles.buttonArea}>
        {routeName.trim() !== 'Book' && (
          <Button
            title="Details"
            type="clear"
            raised
            buttonStyle={{ width: '80%' }}
            onPress={goToDetails}
          />
        )}
        {buttonType()}
      </View>
    </Card>
  );
};

export default Book;
