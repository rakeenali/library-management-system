import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={100} color="blue" />
    </View>
  );
};

export default Loader;
