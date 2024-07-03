import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

import * as Location from 'expo-location';

const Start = ({ navigation }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg("Veuiller autoriser la localisation pour continuer");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('Toutes les infos:', JSON.stringify(location, null, 2));

    const { timestamp } = location;
    const { latitude, longitude, speed, accuracy } = location.coords;

    setLatitude(latitude);
    setLongitude(longitude);
    setSpeed(speed);
    setAccuracy(accuracy);
    setTimestamp(timestamp)
    console.log("Info triée:", { timestamp, latitude, longitude, speed, accuracy, } );
  };
   

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Debut du chargement'.toUpperCase()} </Text>

      <Image
        style={styles.logo}
        source={require('../assets/camion.png')}
      />

      <Button
        title='Retour'
        onPress={() => navigation.goBack()} color = '#7ed957'/>
        <Button
        title='Fin du chargement' 
        onPress={() => {
          getLocation();
          navigation.navigate('Loading');
        }} 
          color = '#7ed957'/>
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
});

export default Start;
