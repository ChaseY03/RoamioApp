import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AccountScreen from "./screens/AccountScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={SplashScreen} screenOptions = {{ headerShown:false}}>
                <Stack.Group>
                    <Stack.Screen name="Splash" component={SplashScreen}  />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Account" component={AccountScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;

/*
*       <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello world</Text>
      <StatusBar style="auto" />
      * return (
    <View style={styles.container}>
        <SplashScreen/>
    </View>
  );
* */