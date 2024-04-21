import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image} from 'react-native';
import { fetchAttractions } from './FetchAttractionsComponent';
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const AttractionsComponent = ({ attractions }) => {
    //console.log("ATTRACTIONS:", attractions);

    // Check if attractions is undefined or null
    if (!attractions) {
        return (
            <View style={styles.container}>
                <Text>Loading attractions...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Attractions</Text>
            {attractions.map((attraction, index) => (
                <View key={index} style={styles.attractionContainer}>
                    <Text style={styles.attractionName}>{attraction.name}</Text>
                    <Image source={{ uri: attraction.image }} style={styles.attractionImage} />
                    <View>
                        <Text style={styles.attractionDetails}>Rating: {attraction.rating}</Text>
                        <Text style={styles.attractionDetails}>Location: {attraction.vicinity}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: "#f3f4f6",
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    attractionContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    attractionName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    attractionImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginVertical: 10,
    },
    attractionDetails: {
        fontSize: 14,
        paddingBottom:10,
    },
});

export default AttractionsComponent;