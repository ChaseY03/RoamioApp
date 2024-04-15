import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from "axios";
import {useIsFocused} from "@react-navigation/native";

const AccountScreen = ({ navigation }) => {
    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const [loggedIn, setLoggedIn] = useState(false);
    const isFocused = useIsFocused(); //used to check if the current screen is the one loaded

    useEffect(() => {
        if (isFocused) {
            checkLoginStatus(); // Call checkLoginStatus only when the screen is focused
        }
    }, [isFocused]); // Add isFocused to the dependency array

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://192.168.1.241:3000/checkLoginStatus');
            setLoggedIn(response.data.loggedIn);
           // console.log("status",loggedIn)
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const handleLogout = async () => {
        try {
            //console.log("logging out")
            const response = await axios.get('http://192.168.1.241:3000/logout');
            setLoggedIn(response.data.loggedIn);
            //console.log("status", loggedIn)
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.container}>
            {loggedIn ? (
                <>
                    <Text style={styles.title}>Welcome to Your Account</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Register for an account or Login</Text>
                    <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </>
            )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountScreen;
