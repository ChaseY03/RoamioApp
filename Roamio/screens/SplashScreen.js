import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        // Simulate a delay to show splash screen for a certain duration
        const timeout = setTimeout(() => {
            // Navigate to 'Home' screen
            navigation.navigate('Home');
        }, 1500); // Adjust duration as needed

        return () => clearTimeout(timeout);
    }, []); // Ensure empty dependency array to run effect only once

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Roamio</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6F61',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default SplashScreen;