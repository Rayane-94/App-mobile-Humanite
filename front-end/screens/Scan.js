import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Scan() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
 // const [photoBase64, setPhotoBase64] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && permission.granted) {
      console.log("Permission de la caméra accordée");
      
    }
  }, [permission]);


  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo prise:', photo.uri);
      setPhotoUri(photo.uri);
      uploadPhoto(photo.uri);
    }
  };

  const handleScanAgain = () => {
    setPhotoUri(null);
    //setPhotoBase64(null);
  };

  const uploadPhoto = async (uri) => {
    const formData = new FormData();
    formData.append('uri', uri);
    console.log('URI:', uri);

    formData.append('photo', {
      uri: uri,
      type: 'image/jpeg', // or 'image/png' if your image is a png
      name: 'photo.jpg', // you can choose any name
    });
    console.log('Image en base64 ici mais trop longue pour etre afficher');

    formData.append('imageUrl', uri);
    console.log('Image URL:', uri);

    const date = new Date().toISOString();
    formData.append('date', date);
    console.log('Date:', date);

    try {
      const response = await fetch('http://192.168.1.106:5000/api/send-contract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Réponse de l\'API:', data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la photo:', error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      console.log('Token récupéré:', token);

      const response = await fetch('http://192.168.1.106:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: null
      });

      const data = await response.json();
      console.log('Réponse de déconnexion:', data);

      if (response.ok) {
        await AsyncStorage.removeItem('userToken');
        navigation.navigate('Connection');
        Alert.alert('Déconnexion réussie', data.message);
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur lors de la déconnexion', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Ramasse'.toUpperCase()}</Text>
      <Text style={styles.subtitle}>{'Blue Project'.toUpperCase()}</Text>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={'back'}
        flashMode={'off'}
      />
      <Button style={styles.deconnexion} title="Déconnexion" onPress={handleLogout} color='#FF6347' />
      <Button
        title='Prendre une photo'
        onPress={handleTakePhoto}
        color='#7ed957'
      />
      {photoUri && (
        <View style={styles.photoPreview}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}
      {photoUri && (
        <View style={styles.buttonNouveau}>
          <Button title="Nouveau Contrat" onPress={handleScanAgain} color="#7ed957" />
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
    marginBottom: 10,
  },
  boutonRetour: {
    marginBottom: 50,
  },
  camera: {
    marginBottom: 50,
    width: '60%',
    height: '40%',
  },
  text: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  photoPreview: {
    alignItems: 'center',
    marginTop: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  deconnexion: {
    borderRadius: 40,
  },
});