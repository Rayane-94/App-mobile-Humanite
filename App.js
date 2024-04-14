import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';
import Home from './screens/Home';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0389eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



export default function App() {
  return (
    
    <View style={styles.container}>
      <Home/>
      <StatusBar style="auto" />
    </View>
    
  );
}


