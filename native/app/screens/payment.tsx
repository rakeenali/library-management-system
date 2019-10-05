import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-elements';

import formatMoney from '../utils/formatMoney';
import Loader from '../components/Loader';
import { api } from '../utils/getVars';
import {
  PaymentResponse,
  PaymentDetails,
  ErrorResponse,
  COMPONENT_STATE
} from '../types';
import { useUserState } from '../context/User';

const PaymentDetail = () => {
  const [state, setState] = React.useState<COMPONENT_STATE>(
    COMPONENT_STATE.LOADING
  );
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [details, setDetails] = React.useState<PaymentDetails[]>([]);
  const userState = useUserState();

  React.useEffect(() => {
    axios
      .get(`${api}/user/rent/detail`, {
        headers: {
          Authorization: `Bearer ${userState.token}`
        }
      })
      .then((res: PaymentResponse) => {
        setState(COMPONENT_STATE.LOADED);
        if (res && res.data) {
          setDetails(res.data);
        }
      })
      .catch((err: ErrorResponse) => {
        setError(true);
        if (err.response && err.response.data) {
          setMessage(err.response.data.error);
        }
        throw new Error(err.message);
      });
  }, []);

  if (state === COMPONENT_STATE.LOADING) {
    return <Loader />;
  } else if (state === COMPONENT_STATE.LOADED) {
    return (
      <ScrollView style={{ marginBottom: 20 }}>
        {details.map(detail => (
          <Card title={detail.username} key={detail.id}>
            <View>
              <Text>You rented book: {detail.title}</Text>
            </View>
            <View>
              <Text>On: {new Date(detail.payment_made_at).toDateString()}</Text>
            </View>
            <View>
              <Text>at price of: {formatMoney(detail.amount)}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    );
  }

  return <View>{error && <Text>{message}</Text>}</View>;
};

export default PaymentDetail;
