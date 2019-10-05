import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from './app/screens/login';
import RegisterScreen from './app/screens/register';

import createStack from './app/utils/createStack';
import createTab from './app/utils/createTab';

const LoginStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    ...createStack('Login')
  }
});

const RegisterStack = createStackNavigator({
  Register: {
    screen: RegisterScreen,
    ...createStack('Register')
  }
});

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Login: {
      screen: LoginStack,
      ...createTab('Login', 'ios-log-in', 'Login', '#756be8')
    },
    Register: {
      screen: RegisterStack,
      ...createTab('Register', 'ios-mail', 'Register', '#6bc5e8')
    }
  },
  {
    shifting: true,
    activeColor: '#eee',
    barStyle: {
      backgroundColor: '#ccc',
      height: 70,
      padding: 5
    }
  }
);

export default createAppContainer(TabNavigator);
