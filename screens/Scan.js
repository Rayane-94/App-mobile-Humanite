import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
//import { FileSystem } from 'expo-file-system';

export default function Scan() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64 : true });
      // Gérer l'enregistrement de la photo localement ici
      console.log('Photo prise:', photo.uri);
      setPhotoUri(photo.uri);
      uploadPhoto(photo.uri) // Enregistrer l'URI de la photo prise dans l'état
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setPhotoUri(null); // Réinitialiser l'aperçu de la photo
  };
  /*const convertB64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    console.log(base64);
    return base64;
    
  };*/
  const uploadPhoto = async (uri) => {
   // const base64 = await convertB64(uri)
    const formData = new FormData();
    formData.append('uri', uri)
    formData.append('photo', {
      uri: uri,
      type: 'image/jpg',
      name: 'photo.jpg',
    });

    formData.append('imageUrl', uri);
    formData.append('date', new Date().toISOString()); // a parametrer au format J/M/A : H:Min
    //formData.append('base64Image', base64); 
    try {

      const response = await fetch('http://192.168.1.106:3000/api/send-contract', {
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

  if (hasPermission === null) {
    return <Text>Autorisez-nous à utiliser votre caméra</Text>;
  }
  if (hasPermission === false) {
    return <Text>Nous ne pouvons accéder à votre caméra</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
      />
     
      <Button style={styles.boutonRetour}
        title='Prendre une photo'
        onPress={handleTakePhoto} color='#7ed957' />

      {photoUri && (
        <View style={styles.photoPreview}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}

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
