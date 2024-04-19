import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        console.log('Email:', email);
        console.log('Password:', password);
        try {
            const response = await axios.post('http://192.168.1.241:3000/login', {
                email: email,
                password: password
            });
            if (response.data.status === "Success") {
                const userID = response.data.userID;
                await AsyncStorage.setItem('userID', JSON.stringify(userID));
                navigation.navigate('AccountStack', { userID }); // Navigate to the account screen with userID
            } else if (response.data.status === "Fail") {
                setErrorMessage("Incorrect email or password");
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Roamio login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="oneTimeCode"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                textContentType="oneTimeCode"
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    backButton: {
        position: 'absolute',
        top: Constants.statusBarHeight,
        left: 20,
        backgroundColor: '#FF6F61',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    loginButton: {
        width: '80%',
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default LoginScreen;
