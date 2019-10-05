import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import axios from 'axios';

import PaymentModal from '../components/PaymentModal';
import formatMoney from '../utils/formatMoney';
import Loader from '../components/Loader';
import { useUserState } from '../context/User';
import { api } from '../utils/getVars';
import {
  ErrorResponse,
  BookRentResponse,
  RentState,
  COMPONENT_STATE
} from '../types';

interface Props {
  navigation: {
    navigate: Function;
    state: {
      params: { isbn: string };
    };
  };
}

const styles = StyleSheet.create({
  viewStyle: {
    marginVertical: 10,
    fontSize: 18
  }
});

const BookReturn = (props: Props) => {
  const { isbn } = props.navigation.state.params;
  const { token } = useUserState();

  const [state, setState] = React.useState<COMPONENT_STATE>(
    COMPONENT_STATE.LOADING
  );
  const [book, setBook] = React.useState<RentState | null>(null);
  const [pay, setPay] = React.useState<boolean>(false);

  React.useEffect(() => {
    axios
      .get(`${api}/user/rent-book/${isbn}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res: BookRentResponse) => {
        setBook(res.data);
        setState(COMPONENT_STATE.LOADED);
      })
      .catch((err: ErrorResponse) => {
        setState(COMPONENT_STATE.IDLE);
        if (err && err.response) {
          throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
      });
  }, [isbn]);

  if (state === COMPONENT_STATE.LOADING) {
    return <Loader />;
  } else if (state === COMPONENT_STATE.LOADED && book !== null) {
    if (book.is_late) {
      return (
        <>
          <PaymentModal
            visibility={pay}
            onClose={() => setPay(false)}
            isbn={isbn}
            {...props}
          />
          <Card
            title="Late Rent Details"
            titleStyle={{ color: 'green', fontSize: 22 }}
          >
            <View style={styles.viewStyle}>
              <Text>
                Your rent time has exceeded by{' '}
                {new Date(book.time_left).toDateString()}
              </Text>
            </View>
            <View style={styles.viewStyle}>
              <Text>If you want to pay now</Text>
            </View>
            <View style={styles.viewStyle}>
              <Text>Please make payment of: {formatMoney(book.payment)} </Text>
            </View>
            <View style={styles.viewStyle}>
              <Button raised title="Pay" onPress={() => setPay(true)} />
            </View>
          </Card>
        </>
      );
    }
    return (
      <>
        <PaymentModal
          visibility={pay}
          onClose={() => setPay(false)}
          isbn={isbn}
          {...props}
        />
        <Card
          title="Rent Details"
          titleStyle={{ color: 'green', fontSize: 22 }}
        >
          <View style={styles.viewStyle}>
            <Text>
              You have time left till {new Date(book.time_left).toDateString()}
            </Text>
          </View>
          <View style={styles.viewStyle}>
            <Text>If you want to pay now</Text>
          </View>
          <View style={styles.viewStyle}>
            <Text>Please make payment of: {formatMoney(book.payment)} </Text>
          </View>
          <View style={styles.viewStyle}>
            <Button raised title="Pay" onPress={() => setPay(true)} />
          </View>
        </Card>
      </>
    );
  }

  return <></>;
};

export default BookReturn;
