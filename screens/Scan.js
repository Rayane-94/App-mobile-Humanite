import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View, StyleSheet, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
//import { useNavigation } from '@react-navigation/native';

export default function Scan() {
  //const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && permission.granted) {
      // Vous pouvez effectuer des actions supplémentaires ici après l'obtention de l'autorisation
    }
  }, [permission]);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.log('Photo prise:', photo.uri);
      setPhotoUri(photo.uri);
      uploadPhoto(photo.uri);

    }
  };

  const handleScanAgain = () => {
    setPhotoUri(null);
  };

  const uploadPhoto = async (uri) => {
    const formData = new FormData();
    formData.append('uri', uri);
    console.log('URI:', uri);

    formData.append('photo', { 
        uri: uri,
        type: 'image/jpg',
        name: 'photo.jpg',
    });

    formData.append('imageUrl', uri);
    console.log('Image URL:', uri);

    const date = new Date().toISOString();
    formData.append('date', date);
    console.log('Date:', date);

    try {
        const response = await fetch('http://192.168.1.106:5000/api/send-contract', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
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
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour utulisez la camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={'back'} 
        flashMode={'off'}
      />
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
  photoPreview: {
    alignItems: 'center',
    marginTop: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
