import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
const RegisterScreen = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {
        console.log('Email:', email);
        console.log('Password:', password);
        if (isValidEmail == true) {
        try {
            const response = await axios.post('http://192.168.1.241:3000/register', {
                email: email,
                password: password
            });
            if (response.data.status === "Success") {
                console.log('Registration success')
                navigation.navigate('AccountStack');
            } else if (response.data.status === "Fail"){
                console.log('Failed to register')
                setErrorMessage("Please enter all details");
            } else if (response.data.status === "Exists"){
                console.log('Found existing account')
                setErrorMessage("User already exists");
            }
        } catch (error) {
            console.error('Error:', error);
        }
        }
        else {
            setErrorMessage("Enter a valid email");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Roamio register</Text>

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
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

        </View>
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
    registerButton :{
        width: '80%',
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    }
});

export default RegisterScreen;
