import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from "../screens/AccountScreen";
import WeatherScreen from "../screens/WeatherScreen";
import SavedLocationsScreen from "../screens/SavedLocationsScreen";
import AttractionsScreen from "../screens/AttractionsScreen";

const Nav = createBottomTabNavigator();

const Navigator = () => {
    return (
        <Nav.Navigator initialRouteName={"Main"} screenOptions={{headerShown:false , tabBarActiveTintColor: "#FF6F61"}} >
            <Nav.Screen name="Weather" component={WeatherScreen} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="cloud" size={size} color={color} />
                ),
            }}/>
            <Nav.Screen name="Attractions" component={AttractionsScreen} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="camera" size={size} color={color} />
                ),
            }}/>
            <Nav.Screen name="Main" component={HomeScreen}  options={{ tabBarLabel: 'Explore' ,
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" size={size} color={color} />
                ),
            }} />
            <Nav.Screen name="Saved locations" component={SavedLocationsScreen} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="bookmark" size={size} color={color} />
                ),
            }}/>
            <Nav.Screen name="Account" component={AccountScreen} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                ),
            }}/>
        </Nav.Navigator>
    );
};

export default Navigator;
