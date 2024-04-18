import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import { fetchDirections } from './FetchComponent';
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
        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepInstruction}>{item.instructions}</Text>
                <Text style={styles.stepDistance}>{item.distance}</Text>
                <Text style={styles.stepDuration}>{item.duration}</Text>
            </View>
        );
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
                    <View key={index}>{renderDirectionItem({ item: step })}</View>
                ))}
            </ScrollView>
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
        maxHeight: 200,
    },
});

export default DirectionsComponent;
