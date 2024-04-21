import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import tw from "tailwind-react-native-classnames";
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import AttractionsComponent from "../components/AttractionsComponent";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {useIsFocused} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
const AttractionsScreen = () => {
    const [location, setLocation] = useState(null);
    const autocompleteRef = useRef(null);

    const attractions = [
        { name: 'restaurant', displayName: 'Restaurant', library: MaterialIcons },
        { name: 'landmark-dome', displayName: 'Landmark', library: FontAwesome6 },
        { name: 'local-cafe', displayName: 'Cafe', library: MaterialIcons },
        { name: 'park', displayName: 'Park', library: MaterialIcons },
        { name: 'museum', displayName: 'Museum', library: MaterialIcons },
        { name: 'shopping-cart', displayName: 'Shopping', library: MaterialIcons }
    ];

    return (
        <SafeAreaView style={[tw`flex-1 bg-white`, Platform.OS === 'android' && { paddingTop: Constants.statusBarHeight }]}>
            <Text style={styles.heading}>Attractions</Text>
            <View style={tw`flex-1`}>
                <View style={styles.autocompleteContainer}>
                    <GooglePlacesAutocomplete
                        styles={{
                            container: { flex: 0 },
                            textInput: { fontSize: 16, ...tw`rounded-lg justify-end items-center` },
                            listView: {...tw`rounded-lg`},
                        }}
                        placeholder={"Change location"}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: "en",
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        ref={autocompleteRef}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={400}
                        minLength={2}
                        onPress={(data, details = null) => {
                            setLocation({
                                name: details?.name,
                                latitude: details?.geometry.location.lat,
                                longitude: details?.geometry.location.lng,
                            });
                        }}
                    />
                </View>

                {/* Horizontal ScrollView for Attractions */}
                <ScrollView style={styles.attractionContainer} horizontal showsHorizontalScrollIndicator={false}>
                    {attractions.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.attractionSelectContainer}>
                            <item.library name={item.name} size={25} color="#FF6F61" />
                            <Text style={styles.attractionsSelectText}>{item.displayName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <AttractionsComponent location={location}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        marginBottom:10,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 10,
        //paddingTop: 10,
    },
    attractionContainer: {
        flex: 1,
        marginTop: 50, // Adjust this value as needed to create space for Autocomplete
    },
    attractionSelectContainer: {
        marginHorizontal: 10,
        alignItems: 'center',
    },
    attractionsSelectText: {
        marginTop: 5,
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
    }
});

export default AttractionsScreen;
