import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from "tailwind-react-native-classnames";
import {WEATHER_API_KEY} from '@env';

//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric

const WeatherScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello, world!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WeatherScreen;