import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Alert} from 'react-native';
import { fetchDirections } from './FetchDirectionsComponent';
import Constants from "expo-constants";
import axios from "axios";
import {Ionicons} from "@expo/vector-icons";
import {log} from "expo/build/devtools/logger";
import {useRoute} from "@react-navigation/native";
const DirectionsComponent = ({ origin, destination, userID, loggedIn }) => {
    const [directions, setDirections] = useState([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [saveMode, setSaveMode] = useState(false);
    const [saveName, setSaveName] = useState('');

    useEffect(() => {
        if (origin && destination) {
            fetchDirections(origin, destination)
                .then(data => {
                    if (data) {
                        const { directions, distance, duration } = data;
                        setDirections(directions);
                        setDistance(distance);
                        setDuration(duration);
                    } else {
                        setDirections([]);
                        setDistance('');
                        setDuration('');
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch directions:', error);
                    setDirections([]);
                    setDistance('');
                    setDuration('');
                });
        }
    }, [origin, destination]);

    const renderDirectionItem = ({ item }) => {
        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepInstruction}>{item.instructions}</Text>
                <Text style={styles.stepDistance}>{item.distance}</Text>
                <Text style={styles.stepDuration}>{item.duration}</Text>
            </View>
        );
    };

    const toggleSaveMenu = async () => {
        setSaveMode(true);
    }
    const handleSaveRoute = async () => {
        const originStr = `${origin.coords.latitude},${origin.coords.longitude}`;
        const destinationStr = `${destination.location.lat},${destination.location.lng}`;
        try {
            const response = await axios.post('http://192.168.1.241:3000/savelocation', {
                userID: userID,
                locationName: saveName,
                origin: originStr,
                destination: destinationStr,
                directions: directions,
                distance: distance,
                duration: duration,
            });
            setSaveMode(false); // Hide the save menu screen
            setSaveName('');
            Alert.alert("Location saved");
            //console.log("save route response", response)
        } catch (error) {
            console.error('Error saving route:', error);
        }
    };

    return (
        <View style={styles.container}>
            {loggedIn && !saveMode ? (
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
                    <TouchableOpacity style={styles.saveButton} onPress={toggleSaveMenu}>
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
    stepDistance: {
        color: 'gray',
    },
    stepDuration: {
        color: 'gray',
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
