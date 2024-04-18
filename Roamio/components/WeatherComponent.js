import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import tw from "tailwind-react-native-classnames";

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