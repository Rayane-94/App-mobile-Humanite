import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Alert} from 'react-native';
import { Image } from 'react-native';


const Home = () => {
  return (
    <View style={styles.container}> 
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>

      <Image source={require('./assets/camion-humanite.png')} />
      
      <Button style={styles.bouton} title='DEPART' onPress={()=> Alert.alert('Bouton apuiyer')} color='#7ed957' />
      <StatusBar style="auto" />
    </View>
  );
} 


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },

  title: {
  bottom:200,
  //backgroundColor : '#FFFF',
  color: '#80dc54',
  fontSize: 80,
  },

  subtitle: {
    //flex; 2,//
    bottom: 180,
    //backgroundColor : '#FFFF',
    color: '#629AE5',
    fontSize: 40,
  },
  bouton: {
    backgroundColor: '#ZERF',
    top: 100,
    borderRadius:0,
    
    //PROPRIETER DU BOUTON NE SONT PAS ENCORE LIER UNNIQUEMENT CEUX DE LA COULEUR APRES LA DECLARATION DANS LE MAIN
    
  },
  
});

export default Home;

