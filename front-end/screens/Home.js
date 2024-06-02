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



/*Code avant mis en place du composant 
const Home = ({ navigation }) => {
  return (
    <View style={styles.container}> 

      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Image
        style={styles.logo}
        source={require('../assets/camion.png')}
      />
      <Button
        title='DEPART' onPress={() => navigation.navigate('Start')} color='#7ed957'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0389eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 80,
    color: '#80dc54',
  },
  subtitle: {
    fontSize: 40,
    color: '#629AE5',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;*/
