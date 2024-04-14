import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';


const Home = () => {
  return (
    <View style={styles.container}> 
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Button title='DEPART' onPress={()=> Alert.alert('Boutton apuiyer')} />
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
    bottom:180,
    bagroundColor : '#FFFF',
    color: '#629AE5',
    fontSize: 40,
  }
  
});

export default Home;

