import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, Image, Text, TouchableOpacity, TextInput, Button} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Connection({ navigation }) {
  
  const [form, setForm] = useState({
    adresse_email: '',
    mot_de_passe: '',
  });

  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const sendLoginData = async () => {

    const { adresse_email, mot_de_passe } = form;

   
    if (!emailRegex.test(adresse_email)) {
      Alert.alert('Erreur', 'Adresse e-mail invalide, caractere speciaux non autoriser');
      return;
    }

    
    if (!passwordRegex.test(mot_de_passe)) {
      Alert.alert('Erreur', 'Le mot de passe doit comporter au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caracteres');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.106:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);  
        Alert.alert('Connexion réussie', data.message);
        navigation.navigate('Home');
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur s'est produite, veuillez réessayer");
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.ImgLogo}
              source={require('../assets/ummanite-logo.png')} />
              
            <Text style={styles.title}>
               <Text style={{ color: '#075eec' }}>Connecte toi </Text>
            </Text>
            <Text style={styles.subtitle}>
              Tu pourra ensuite ajouter les contrats
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Adresse e-mail</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={adresse_email => setForm({ ...form, adresse_email })}
                placeholder="Saissisez votre e-mail"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.adresse_email} />

            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={mot_de_passe => setForm({ ...form, mot_de_passe })}
                placeholder="Saississez le mot de passe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.mot_de_passe} />
            </View>
            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => { sendLoginData({navigation}) }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Se connecter</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Button
        title='Test Navigation '
        onPress={() => navigation.navigate('Home')} color = '#7ed957'/>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,  // Permet à l'élément de grandir pour occuper tout l'espace disponible.
    flexShrink: 1,  // Permet à l'élément de rétrécir si l'espace est limité.
    flexBasis: 0, // La taille initiale de l'élément est de 0, ajustée ensuite par flexGrow et flexShrink.
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  ImgLogo: {
    width: 225,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});