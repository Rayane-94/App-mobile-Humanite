import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const Home = () => {
  return (
    <View style={styles.container}> 
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <StatusBar style="auto" />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  title:{
    
    //flex: 1,//
  color: '#80dc54',
  fontSize: 80,
  },
  subtitle:{
    //flex; 2,//
    color: '#629AE5',
    fontSize: 40,
  }
});

export default Home;

