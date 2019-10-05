import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Books from './app/screens/books';
import Rent from './app/screens/rent';
import Book from './app/screens/book';
import BookReturn from './app/screens/book-return';
import PaymentDetailScreen from './app/screens/payment';

import createStack from './app/utils/createStack';
import createTab from './app/utils/createTab';

const BookStack = createStackNavigator(
  {
    Books: {
      screen: Books,
      ...createStack('Books')
    },
    Book: {
      screen: Book,
      ...createStack('Book')
    },
    BookReturn: {
      screen: BookReturn,
      ...createStack('Return Book')
    }
  },
  {
    initialRouteName: 'Books'
  }
);

const RentStack = createStackNavigator(
  {
    Rent: {
      screen: Rent,
      ...createStack('Rent')
    }
  },
  { initialRouteName: 'Rent' }
);

const PaymentDetailStack = createStackNavigator(
  {
    PaymentDetail: {
      screen: PaymentDetailScreen,
      ...createStack('Payment')
    }
  },
  { initialRouteName: 'PaymentDetail' }
);

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Books: {
      screen: BookStack,
      ...createTab('Books', 'ios-book', 'Books', '#a3956f')
    },
    Rent: {
      screen: RentStack,
      ...createTab('Rent', 'ios-card', 'Rent', '#34cbd9')
    },
    PaymentDetail: {
      screen: PaymentDetailStack,
      ...createTab('Payment', 'ios-bookmarks', 'Payment', '#53b85e')
    }
  },
  {
    initialRouteName: 'Books',
    shifting: true,
    activeColor: '#eee',
    barStyle: {
      height: 70,
      padding: 5
    }
  }
);

export default createAppContainer(TabNavigator);
