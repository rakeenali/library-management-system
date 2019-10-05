import React from 'react';
import { Text, View } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import axios from 'axios';

import { useUserDispatch, setUserLogin } from '../context/User';

import { api } from '../utils/getVars';
import { ErrorResponse, TokenResponse } from '../types/types';

interface FormProps {
  username: string;
  password: string;
}

function login() {
  const [fields, setFields] = React.useState<FormProps>({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const userDispatch = useUserDispatch();

  const changeFields = (type: 'username' | 'password', text: string) => {
    setFields({
      ...fields,
      [type]: text
    });
  };

  const submitForm = () => {
    if (fields.username.trim() === '' || fields.password.trim() === '') {
      setError(true);
      setMessage('Please fill out the form correctly');
      return;
    }
    setLoading(true);
    const data = { username: fields.username, password: fields.password };
    axios
      .post(`${api}/user`, data)
      .then((res: TokenResponse) => {
        setLoading(false);
        if (res && res.data) {
          setUserLogin(res.data.token, userDispatch);
        }
      })
      .catch((err: ErrorResponse) => {
        if (err && err.response.data) {
          setLoading(false);
          setError(true);
          setMessage(err.response.data.error);
        }
        throw err;
      });
  };

  return (
    <View>
      <Card title="Login" titleStyle={{ color: '#756be8' }}>
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
              title="Login"
              containerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 10
              }}
              buttonStyle={{
                padding: 10,
                backgroundColor: '#756be8'
              }}
              onPress={submitForm}
            />
          </View>
        </>
      </Card>
    </View>
  );
}

export default login;
