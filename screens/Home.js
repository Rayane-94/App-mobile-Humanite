import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const Home = () => {
  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Ramasse</Text>
      <StatusBar style="auto"/>
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
  color: '#80dc54',
  }
});

export default Home;

