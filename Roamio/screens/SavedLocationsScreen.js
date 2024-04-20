import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import tw from "tailwind-react-native-classnames";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SavedLocationsScreen = () => {
    const [savedLocations, setSavedLocations] = useState([]);
    const [userID, setUserID] = useState(null);
    const [tripName, setTripName] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);
    const [showInformation, setShowInformation] = useState(false);

    const isFocused = useIsFocused();
    useEffect(() => {
        // Retrieve userID from AsyncStorage
        if (isFocused) {
            const retrieveUserID = async () => {
                try {
                    const storedUserID = await AsyncStorage.getItem('userID');
                    if (storedUserID !== null) {
                        const parsedUserID = JSON.parse(storedUserID);
                        setUserID(parsedUserID);
                        fetchSavedLocations(parsedUserID);
                        setShowInformation(false);
                    } else {
                        setUserID(null);
                        setSavedLocations([]);
                    }
                } catch (error) {
                    console.error('Error retrieving userID:', error);
                }
            };
            retrieveUserID();
        }
    }, [isFocused]);

    const fetchSavedLocations = async (userID) => {
        try {
            const response = await axios.get('http://192.168.1.241:3000/savedlocations', {
                params: { userID: userID }
            });

            if (response.data.message === 'Success') {
                const locations = response.data;
                setSavedLocations(response.data.savedLocations);
                return locations;
            }
        } catch (error) {
            console.error('Error fetching saved locations:', error);
            throw error;
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleShowTrip(item)}>
            <View style={tw`flex-1`} key={index}>
                <Text>Trip: {index + 1}</Text>
                <Text>{item.savedlocationName}</Text>
            </View>
            <Ionicons name={"chevron-forward"} size={20} style={tw`mx-auto`} />
        </TouchableOpacity>
    );

    const handleShowTrip = (item) => {
        setShowInformation(true);
        setTripName(item.savedlocationName);
        setTripDetails(JSON.parse(item.savedlocationDirections));
    };

    return (
        <SafeAreaView style={styles.container}>
            {userID ? (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.locationsContainer}>
                        <Text style={styles.heading}>Saved Locations</Text>
                        <ScrollView>
                            {savedLocations.map((item, index) => (
                                <View key={index}>{renderItem({ item, index })}</View>
                            ))}
                        </ScrollView>
                    </View>
                    {showInformation && (
                        <View style={styles.informationContainer}>
                            <Text style={styles.heading}>Directions to: {tripName}</Text>
                            <ScrollView style={styles.scrollViewContent}>
                                {tripDetails && (
                                    tripDetails.map((step, index) => (
                                        <View key={index} style={styles.stepContainer}>
                                            <Text style={styles.stepInstruction}>{step.instructions}</Text>
                                            <Text style={styles.stepInfo}>Distance: {step.distance}</Text>
                                            <Text style={styles.stepInfo}>Duration: {step.duration}</Text>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    )}
                </KeyboardAvoidingView>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text>Login to save locations</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationsContainer: {
        flex: 1,
    },
    scrollViewContent: {
        //maxHeight: 150,
    },
    informationContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        //marginTop: 20,
        paddingTop:10,
        flex: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    stepInstruction: {
        fontSize: 16,
    },
    stepInfo: {
        color: 'gray',
        marginLeft: 10,
    },
});

export default SavedLocationsScreen;
