import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from "axios";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loggedIn, setLoggedIn] = useState(false);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        // Check login status when the screen is focused
        if (isFocused) {
            checkLoginStatus();
            retrieveUserID();
        }
    }, [isFocused]);

    const retrieveUserID = async () => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID !== null) {
                setUserID(JSON.parse(storedUserID));
            }
        } catch (error) {
            console.error('Error retrieving userID:', error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://192.168.1.241:3000/checkLoginStatus');
            setLoggedIn(response.data.loggedIn);
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://192.168.1.241:3000/logout');
            if (response.data.loggedOut) {
                await AsyncStorage.clear();
                setLoggedIn(false);
                setUserID(null);
            } else {
                Alert.alert('Logout Failed', 'Failed to logout. Please try again.');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            {loggedIn ? (
                <>
                    <Text style={styles.title}>Welcome to Your Account</Text>
                    {userID ? (
                        <Text style={styles.title}>User ID: {userID}</Text>
                    ) : (
                        <Text style={styles.title}>User ID not available</Text>
                    )}
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
