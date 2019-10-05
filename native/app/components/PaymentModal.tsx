import React from 'react';
import { View, Modal, StyleSheet, Text } from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import axios from 'axios';

import { useAlertDispatch } from '../context/Alert';
import { api } from '../utils/getVars';
import { useUserState, useUserDispatch } from '../context/User';
import { ErrorResponse, TokenResponse, SuccessMessage } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
  },
  error: {
    padding: 5,
    marginVertical: 5,
    fontSize: 18
  },
  inputSpacing: {
    marginVertical: 8
  }
});

interface Props {
  visibility: boolean;
  onClose: Function;
  isbn: string;
  navigation?: {
    navigate: Function;
  };
}

interface FormProps {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCvc: string;
}

const PaymentModal = (props: Props) => {
  const { token } = useUserState();
  const alertDispatch = useAlertDispatch();
  const userDispatch = useUserDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [fields, setFields] = React.useState<FormProps>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardCvc: ''
  });

  const onChange = (name: string, value: string) => {
    setFields(n => ({ ...n, [name]: value }));
  };

  const proceed = () => {
    if (
      fields.cardNumber.trim() === '' ||
      fields.expiryYear.trim() === '' ||
      fields.expiryMonth.trim() === '' ||
      fields.cardCvc.trim() === ''
    ) {
      setMessage('Form fields must not be empty required');
      setError(true);
      return;
    }
    setLoading(true);
    const data = {
      number: fields.cardNumber,
      exp_month: fields.expiryMonth,
      exp_year: fields.expiryYear,
      cvc: fields.cardCvc
    };
    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios
      .post(`${api}/user/rent-token`, data, { headers })
      .then((tokenRes: TokenResponse) => {
        return axios.post(
          `${api}/user/rent-charge/${props.isbn}`,
          { token: tokenRes.data.token },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      })
      .then((res: SuccessMessage) => {
        if (res && res.data) {
          props.onClose();
          props.navigation.navigate('Books');
          userDispatch({ type: 'REMOVE_BOOK', payload: props.isbn });
          alertDispatch({ type: 'SHOW_ALERT', payload: res.data.message });
        }
      })
      .catch((err: ErrorResponse) => {
        setLoading(false);
        setError(true);
        if (err && err.response) {
          console.log(err.response.data);
          setMessage(err.response.data.error);
          return;
        }
        throw new Error(err.message);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visibility}
      onRequestClose={() => props.onClose()}
    >
      <View style={styles.container}>
        {error && (
          <View style={styles.error}>
            <Text style={{ textAlign: 'center', color: 'red' }}>{message}</Text>
          </View>
        )}
        <Card title="Card information">
          <View style={styles.inputSpacing}>
            <Input
              placeholder="Card Number"
              label="Card Number"
              textContentType="creditCardNumber"
              value={fields.cardNumber}
              onChangeText={text => onChange('cardNumber', text)}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Input
              placeholder="Expiry Month"
              label="Card Expiry Month"
              value={fields.expiryMonth}
              onChangeText={text => onChange('expiryMonth', text)}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Input
              placeholder="Expiry Year"
              label="Card Expiry Year"
              value={fields.expiryYear}
              onChangeText={text => onChange('expiryYear', text)}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Input
              placeholder="CVC Number"
              label="Card CVC Number"
              value={fields.cardCvc}
              onChangeText={text => onChange('cardCvc', text)}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Button title="Process" onPress={proceed} loading={loading} />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

export default PaymentModal;
