import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-elements';

import Loader from '../components/Loader';
import { RentBook, COMPONENT_STATE } from '../types';
import { useUserState } from '../context/User';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    justifyContent: 'center',
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

const rent = props => {
  const [books, setBooks] = React.useState<RentBook[]>([]);
  const [state, setState] = React.useState<COMPONENT_STATE>(
    COMPONENT_STATE.LOADING
  );

  const userState = useUserState();

  React.useEffect(() => {
    if (userState.rentBooks.length) {
      setState(COMPONENT_STATE.LOADED);
      setBooks(userState.rentBooks);
      return;
    }
    setState(COMPONENT_STATE.IDLE);
  }, [userState.rentBooks]);

  const goToDetails = (book: RentBook) => {
    props.navigation.navigate('Book', { isbn: book.isbn });
  };

  const returnBook = (book: RentBook) => {
    props.navigation.navigate('BookReturn', { isbn: book.isbn });
    return;
  };

  if (state === COMPONENT_STATE.LOADING) {
    return <Loader />;
  } else if (state === COMPONENT_STATE.LOADED) {
    return (
      <ScrollView>
        {books.map(book => (
          <Card title={book.title} key={book.id}>
            <View>
              <Image source={{ uri: book.book_image }} style={styles.image} />
              <Text>{book.description}</Text>
            </View>
            <View style={styles.cta}>
              <Text>Rent Price: {book.rent_price}</Text>
            </View>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>
                Rented on: {new Date(book.rented_on).toDateString()}
              </Text>
            </View>
            <View style={styles.buttonArea}>
              <Button
                title="Details"
                type="clear"
                raised
                buttonStyle={{ width: '80%' }}
                onPress={() => goToDetails(book)}
              />
              <Button
                title="Return"
                type="solid"
                buttonStyle={{ width: '80%' }}
                onPress={() => returnBook(book)}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.center}>
      <Text>You hanve not currently rented any books</Text>
    </View>
  );
};

export default rent;
