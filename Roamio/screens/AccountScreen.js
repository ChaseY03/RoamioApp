import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from "axios";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = ({ navigation }) => {
    //const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(false);
   // const { userID } = route.params || {};
    //const [userIDState, setUserIDState] = useState(null);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        // Check if userID exists in AsyncStorage
        retrieveUserID();
    }, []);

    const storeUserID = async (userID) => {
        try {
            const userIDString = JSON.stringify(userID); // Stringify the userID
            await AsyncStorage.setItem('userID', userIDString);
            setUserID(userID);
        } catch (error) {
            console.error('Error storing userID:', error);
        }
    };

    const retrieveUserID = async () => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID !== null) {
                // Parse the stored userID back to its original format
                const userID = JSON.parse(storedUserID);
                // userID found in AsyncStorage
                setUserID(userID);
            }
        } catch (error) {
            console.error('Error retrieving userID:', error);
        }
    };



    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };



    const isFocused = useIsFocused(); //used to check if the current screen is the one loaded

    //navigation.navigate('Main', { userID });
    useEffect(() => {
        if (isFocused) {
            checkLoginStatus(); // Call checkLoginStatus only when the screen is focused
            //navigation.navigate('Main', { userID });
            //setUserIDState(userID);
           // console.log(userID)
        }
   // }, [isFocused, userID]); // Add isFocused to the dependency array
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
            await AsyncStorage.removeItem('userID');
            await AsyncStorage.clear();
            // Get all keys from AsyncStorage
            const getAllKeys = async () => {
                let keys = [];
                try {
                    keys = await AsyncStorage.getAllKeys();
                    console.log(keys);
                } catch (e) {
                    console.error('Error reading AsyncStorage keys:', e);
                }
            };

            // Call getAllKeys function
            await getAllKeys();
            //console.log(userID)
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
