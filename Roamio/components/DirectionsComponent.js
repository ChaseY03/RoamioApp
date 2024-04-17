import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import { fetchDirections } from './MapsComponent';
import Constants from "expo-constants";
const DirectionsComponent = ({ origin, destination, travelMode }) => {
    const [directions, setDirections] = useState([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (origin && destination) {
            fetchDirections(origin, destination, travelMode)
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
    }, [origin, destination, travelMode]);

    const renderDirectionItem = ({ item }) => {
        return <Text style={styles.direction}>{item.instructions}</Text>;
    };

    return (
        <>
            <Text style={styles.infoText}>Distance: {distance}</Text>
            <Text style={styles.infoText}>Duration: {duration}</Text>
            <Text style={styles.heading}>Directions:</Text>
            {/* {directions.map((step, index) => (
                <Text key={index}>{step.instructions}</Text>
            ))}
            <FlatList
                data={directions}
                renderItem={renderDirectionItem}
                keyExtractor={(item, index) => index.toString()}
            />
            */}
            {directions.map((step, index) => (
                <Text key={index}>{step.instructions}</Text>
            ))}

        </>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f0f0f0',
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
});

export default DirectionsComponent;
