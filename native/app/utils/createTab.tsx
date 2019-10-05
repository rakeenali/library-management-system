import React from 'react';

import Icon from './Icon';

function createTab(
  title: string,
  iconName: string,
  label: string,
  bgColor: string
): any {
  return {
    navigationOptions: {
      title,
      tabBarIcon: ({ focused }) => {
        return <Icon {...{ iconName, focused, bgColor }} />;
      },
      tabBarLabel: label,
      barStyle: {
        backgroundColor: bgColor,
        height: 70,
        padding: 5
      }
    }
  };
}

export default createTab;
