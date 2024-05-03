import React, { useState, useEffect } from 'react';
import { Button, Text, View,StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function Scan() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // Ajout de l'état scanner

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Le type de QRCode est ${type} et son content ${data} a eter scanner!`);
  };

  const handleScanAgain = () => { // Fonction pour gérer le scan à nouveau
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Autoriser vous que nous utulisons votre camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Nous ne pouvons acceder a votre camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} // Ignorer le scan si déjà scanné
      />
      <Button style={styles.boutonRetour}
        title='Retour'
        onPress={() => navigation.goBack()} color='#7ed957' />

      
      {scanned && (
        <View style={styles.buttonNouveau}>
          <Button title="Nouveau Qr code" onPress={handleScanAgain} color="#7ed957" />
        </View>
      )}
    </View>
  );
}

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
    marginBottom:50,
  },
  boutonRetour: {
    marginBottom:50,
  },
 
  camera: {
    marginBottom:50,
    width: '60%',
    height: '40%',
  },
  text: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  
 
});
