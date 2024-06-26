import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { fetchDirections } from './FetchDirectionsComponent';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const DirectionsComponent = ({ origin, destination, transportMode }) => {
    const [directions, setDirections] = useState([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [saveMode, setSaveMode] = useState(false);
    const [saveName, setSaveName] = useState('');
    const [note, setNote] = useState('');
    const [userID, setUserID] = useState(null); // State to hold the retrieved userID
    const [stops, setStops] = useState([]);

    useEffect(() => {
        retrieveUserID(); // Retrieve userID when the component mounts
    }, []);

    useEffect(() => {
        if (origin && destination) {
            fetchDirections(origin, destination, transportMode)
                .then(data => {
                    if (data) {
                        const { directions, distance, duration, stops } = data;
                        setDirections(directions);
                        setDistance(distance);
                        setDuration(duration);
                        setStops(stops);
                    } else {
                        setDirections([]);
                        setDistance('');
                        setDuration('');
                        setStops([]);
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch directions:', error);
                    setDirections([]);
                    setDistance('');
                    setDuration('');
                    setStops([]);
                });
        }
    }, [origin, destination, transportMode]);

    const renderDirectionItem = ({ item }) => {
        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepInstruction}>{item.instructions}</Text>
                <Text style={styles.stepInfo}>{item.distance}</Text>
                <Text style={styles.stepInfo}>{item.duration}</Text>
            </View>
        );
    };

    const renderStopItem = (stop, index) => {
        const vehicleType = stop.vehicleType;
        const lineInfo = vehicleType === 'BUS' ? `Bus number: ${stop.lineName}` : `Line: ${stop.lineName}`;
        return (
            <View style={styles.stepContainer} key={index}>
                <Text style={styles.stepInstruction}>Stop {index + 1}</Text>
                <Text style={styles.stepInstruction}>Get on at: {stop.departureStop}</Text>
                <Text style={styles.stepInstruction}>Get off at: {stop.arrivalStop}</Text>
                <Text style={styles.stepLine}>{lineInfo}</Text>
                <Text style={styles.stepInfo}>{stop.duration}</Text>
            </View>
        );
    };

    const retrieveUserID = async () => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID !== null) {
                // Parse the stored userID back to its original format
                const userID = JSON.parse(storedUserID);
                // userID found in AsyncStorage
                //console.log("UserID retrieved from AsyncStorage:", userID);
                setUserID(userID); // Set the retrieved userID in state
            }
        } catch (error) {
            console.error('Error retrieving userID:', error);
        }
    };

    const toggleSaveMenu = async () => {
        setSaveMode(true);
    };

    const handleSaveRoute = async () => {
        const originStr = `${origin.coords.latitude},${origin.coords.longitude}`;
        const destinationStr = `${destination.location.lat},${destination.location.lng}`;
        try {
            if (!userID) {
                console.error('UserID not found in state');
                return;
            }
            if (!saveName.trim()) {
                Alert.alert('Error', 'Please enter a name');
                return;
            }
            const response = await axios.post('http://192.168.1.241:3000/savelocation', {
                userID: userID,
                locationName: saveName,
                origin: originStr,
                destination: destinationStr,
                directions: directions,
                distance: distance,
                duration: duration,
                note: note, // Include the note field here
            });
            setSaveMode(false); // Hide the save menu screen
            setSaveName('');
            setNote('');
            Alert.alert("Location saved", "Now viewable in your saved locations");
        } catch (error) {
            console.error('Error saving route:', error);
        }
    };

    return (
        <View style={[styles.container, transportMode === 'transit']}>
            {userID && !saveMode ? (
                <TouchableOpacity style={styles.saveButton} onPress={toggleSaveMenu}>
                    <Ionicons name="bookmark" size={20} color="#FFF" />
                </TouchableOpacity>
            ) : null}
            {saveMode ? (
                <View style={styles.saveModeContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Save a trip name"
                        value={saveName}
                        onChangeText={setSaveName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Add a note?"
                        value={note}
                        onChangeText={setNote}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoute}>
                        <Ionicons name="bookmark" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Distance: {distance}</Text>
                        <Text style={styles.infoText}>Duration: {duration}</Text>
                    </View>
                    <Text style={styles.heading}>Directions:</Text>
                    <ScrollView style={styles.scrollView}>
                        {directions.map((step, index) => (
                            <View key={index}>{renderDirectionItem({ item: step })}</View>
                        ))}
                    </ScrollView>
                    {transportMode === 'transit' && (
                        <>
                            <Text style={styles.heading}>Transit information:</Text>
                            <ScrollView style={styles.scrollView}>
                                {stops.map((stop, index) => renderStopItem(stop, index))}
                            </ScrollView>
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    stepContainer: {
        marginBottom: 10,
    },
    stepInstruction: {
        fontSize: 16,
    },
    stepInfo: {
        color: 'gray',
    },
    stepLine:{
        color: 'red'
    },
    scrollView: {
        maxHeight: 150,
    },
    saveButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveModeContainer: {
        marginTop: 10,
    },
});

export default DirectionsComponent;
