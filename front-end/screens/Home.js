import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import MonHeader from '../components/Header';



const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MonHeader navigation={navigation} buttonTitle="DÉPART" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0389eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;




