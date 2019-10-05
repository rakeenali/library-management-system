import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import jwtDecode from 'jwt-decode';
import { Button } from 'react-native-elements';

import { useUserState, useUserDispatch } from '../context/User';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    padding: 4,
    width,
    height: 70,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    backgroundColor: '#ccc',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0,.8)',
    zIndex: 10
  },
  menuStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width - 100,
    height: '100%',
    backgroundColor: '#eee',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const Header = props => {
  const { token, authState } = useUserState();
  const userDispatch = useUserDispatch();
  const [menu, setMenu] = React.useState<boolean>(false);

  const showMenu = () => {
    setMenu(n => !n);
  };

  const logout = () => {
    userDispatch({ type: 'NO_USER' });
  };

  if (authState === 'USER') {
    return (
      <>
        {menu && (
          <>
            <View style={styles.menuOverlay}></View>
            <View style={styles.menuStyle}>
              <Button title="Logout" type="outline" raised onPress={logout} />
              <Button
                onPress={showMenu}
                title="X"
                type="clear"
                raised
                titleStyle={{ fontSize: 22 }}
                containerStyle={{ marginTop: 20 }}
              />
            </View>
          </>
        )}
        <View style={styles.header}>
          <TouchableOpacity style={{ flexBasis: '30%' }} onPress={showMenu}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '300',
                borderBottomColor: '#fff',
                borderRadius: 30,
                borderBottomWidth: 1.5,
                textAlign: 'center'
              }}
            >
              {jwtDecode(token).identity}
            </Text>
          </TouchableOpacity>
          <View style={{ flexBasis: '40%' }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold'
              }}
            >
              {props.title}
            </Text>
          </View>
          <View style={{ flexBasis: '30%' }}>
            <Text />
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.header}>
      <View style={{ flexBasis: '30%' }}></View>
      <View style={{ flexBasis: '40%' }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          {props.title}
        </Text>
      </View>
      <View style={{ flexBasis: '30%' }}>
        <Text />
      </View>
    </View>
  );
};

function createStack(headerTitle: string): any {
  return {
    navigationOptions: {
      header: <Header title={headerTitle} />
    }
  };
}

export default createStack;
