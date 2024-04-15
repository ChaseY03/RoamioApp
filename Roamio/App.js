import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './navigation/Navigation';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const App = () => {
    const [transition, setTransition] = useState(false);

    useEffect(() => {
        // Simulate loading time
        setTimeout(() => {
            setTransition(true);
        }, 2000); // Adjust the delay as needed
    }, []);

    return (
        <NavigationContainer>
            <StatusBar style={"dark"}/>
            {transition ? (
                <Navigator />
            ) : (
                <SplashScreen />
            )}
        </NavigationContainer>
    );
};

export default App;

/*
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AccountScreen from "./screens/AccountScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import Navigation from './navigation/Navigation';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <StatusBar style={"dark"}/>
            <Stack.Navigator initialRouteName={SplashScreen} screenOptions = {{ headerShown:false}}>
                <Stack.Group>
                    <Stack.Screen name="Splash" component={SplashScreen}  />
                    <Stack.Screen name="Home" component={Navigation} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

/*
 <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
*       <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello world</Text>
      <StatusBar style="auto" />
      * return (
    <View style={styles.container}>
        <SplashScreen/>
    </View>
  );
* */