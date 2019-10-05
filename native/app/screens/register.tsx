import React from 'react';
import { Text, View } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import axios from 'axios';

import { api } from '../utils/getVars';

import { useAlertDispatch } from '../context/Alert';
import { ErrorResponse, SuccessMessage } from '../types/types';

interface FormProps {
  username: string;
  password: string;
}

function register(props) {
  const [fields, setFields] = React.useState<FormProps>({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const alertDispatch = useAlertDispatch();

  const changeFields = (type: 'username' | 'password', text: string) => {
    setFields({
      ...fields,
      [type]: text
    });
  };

  const submitForm = async () => {
    if (fields.username.trim() === '' || fields.password.trim() === '') {
      setError(true);
      setMessage('Please fill out the form correctly');
      return;
    }
    setLoading(true);
    const data = { username: fields.username, password: fields.password };
    axios
      .post(`${api}/user/register`, data)
      .then((res: SuccessMessage) => {
        setLoading(false);
        if (res && res.data) {
          alertDispatch({
            type: 'SHOW_ALERT',
            payload: `${res.data.message} you can now login`
          });
          props.navigation.navigate('Login');
          return;
        }
      })
      .catch((err: ErrorResponse) => {
        setLoading(false);
        if (err && err.response) {
          setError(true);
          setMessage(err.response.data.error);
        }
      });
  };

  return (
    <View>
      <Card title="Register" titleStyle={{ color: '#6bc5e8' }}>
        <>
          {error && (
            <View
              style={{
                margin: 5,
                padding: 2,
                borderBottomColor: '#f03c54',
                borderBottomWidth: 0.7
              }}
            >
              <Text
                style={{
                  color: '#f03c54',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                {message}
              </Text>
            </View>
          )}
          <View>
            <Input
              autoFocus
              autoCapitalize="none"
              placeholder="Enter your username"
              value={fields.username}
              containerStyle={{ marginVertical: 15 }}
              onChangeText={text => changeFields('username', text)}
            />
            <Input
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Enter your password"
              value={fields.password}
              containerStyle={{ marginVertical: 15 }}
              onChangeText={text => changeFields('password', text)}
            />
          </View>
          <View>
            <Button
              loading={loading}
              title="Register"
              containerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 10
              }}
              buttonStyle={{
                padding: 10,
                backgroundColor: '#6bc5e8'
              }}
              onPress={submitForm}
            />
          </View>
        </>
      </Card>
    </View>
  );
}

export default register;
