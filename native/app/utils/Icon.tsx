import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  iconName: string;
  focused: boolean;
  bgColor: string;
}

export default ({ iconName, focused, bgColor }: Props) => {
  if (!focused) {
    return <Ionicons size={25} name={iconName} color={bgColor} />;
  }
  return <Ionicons size={30} name={iconName} color="#eee" />;
};
