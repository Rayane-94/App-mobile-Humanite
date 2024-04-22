import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import Home from './screens/Home';
import Start from './screens/Start';
import Loading from './screens/Loading';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0389eb',
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>

      <NavigationContainer>
{/*screenOptions={{headerShown: false}} */}
        <Stack.Navigator initialRouteName="Home"  > 
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Loading" component={Loading} />
        </Stack.Navigator>

      </NavigationContainer>
      <StatusBar style="auto" />

    </View>
  );
}
