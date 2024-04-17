import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import { fetchDirections } from './MapsComponent';
import Constants from "expo-constants";
const DirectionsComponent = ({ origin, destination }) => {
    const [directions, setDirections] = useState([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

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
        return <Text style={styles.direction}>{item.instructions}</Text>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Distance: {distance}</Text>
                <Text style={styles.infoText}>Duration: {duration}</Text>
            </View>
            <Text style={styles.heading}>Directions:</Text>
            <ScrollView style={styles.scrollView}>
                {directions.map((step, index) => (
                    <Text key={index} style={styles.step}>{step.instructions}</Text>
                ))}
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        //marginTop: Constants.statusBarHeight + 150,
        padding: 10,
        //backgroundColor: '#f0f0f0',
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
    step: {
        marginBottom: 10, // Add margin between each step
        //fontSize: 16, // Adjust font size as needed
        lineHeight: 15, // Adjust line height for spacing between lines
    },
    scrollView: {
        maxHeight: 200, // Set maximum height for ScrollView
    },
});

export default DirectionsComponent;
