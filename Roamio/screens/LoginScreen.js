import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";


const LoginScreen = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        console.log('Email:', email);
        console.log('Password:', password);
        try {
            const response = await axios.post('http://192.168.1.241:3000/login', {
                email: email,
                password: password
            });
            if (response.data === "Success") {
                // alert("Logged in"); //DEV CODE REMOVE LATER
                console.log('Login success')
            } else {
                console.log('No login found')
                alert("No login found");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>LOGIN</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
    loginButton :{
        width: '80%',
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    }
});

export default LoginScreen;
