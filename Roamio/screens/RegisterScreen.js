import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegisterScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to My App</Text>
            <Text style={styles.subtitle}>This is the default page template</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Set your desired background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#555', // Set your desired text color
    },
});

export default RegisterScreen;
