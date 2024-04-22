import React from 'react';
import { Button, Text,View, Image , StyleSheet} from 'react-native';



const Scan = ({navigation}) => {
    return(
        
        <View style={styles.container}>
      <Text style={styles.title}> {'Ramasse'.toUpperCase()} </Text>
      <Text style={styles.subtitle}> {'Blue Project'.toUpperCase()} </Text>
      <Button
        title='Retour'
        onPress={() => navigation.goBack()} color = '#7ed957'/>
       
    </View>

    )
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
    },
  });
export default Scan