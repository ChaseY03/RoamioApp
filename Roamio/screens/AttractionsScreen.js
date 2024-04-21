import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import tw from "tailwind-react-native-classnames";
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {FontAwesome5, Ionicons, MaterialIcons,FontAwesome6} from '@expo/vector-icons';
import AttractionsComponent from "../components/AttractionsComponent";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {useIsFocused} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
import {fetchAttractions} from "../components/FetchAttractionsComponent";
const AttractionsScreen = () => {
    const [location, setLocation] = useState(null);
    const [attractions, setAttractions] = useState(null);
    const [selectedAttractionType, setSelectedAttractionType] = useState(null);
    const autocompleteRef = useRef(null);

    const attractionsOptions = [
        { name: 'globe', displayName: 'View all', type: null, library: FontAwesome6 },
        { name: 'restaurant', displayName: 'Restaurant', type: "restaurant", library: MaterialIcons },
        { name: 'landmark-dome', displayName: 'Landmark', type: "landmark,point_of_interest", library: FontAwesome6 },
        { name: 'local-cafe', displayName: 'Cafe', type: "cafe", library: MaterialIcons },
        { name: 'bakery-dining', displayName: 'Bakery', type: "bakery", library: MaterialIcons },
        { name: 'glass-martini', displayName: 'Bar', type: "bar", library: FontAwesome5 },
        { name: 'forest', displayName: 'Park', type: "park", library: MaterialIcons },
        { name: 'museum', displayName: 'Museum', type: "museum", library: MaterialIcons },
        { name: 'shopping-cart', displayName: 'Shopping', type: "shopping_mall", library: FontAwesome5 },
        { name: 'sports-gymnastics', displayName: 'Gym', type: "gym", library: MaterialIcons },
        { name: 'gas-pump', displayName: 'Fuel station', type: "gas_station", library: FontAwesome6 },
    ];

    const handleAttractionTypePress = (type) => {
        setSelectedAttractionType(type);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        // Resets when user clicks on weather screen tab
        if (isFocused) {
            if (autocompleteRef.current) {
                autocompleteRef.current.setAddressText(''); // Set the value to an empty string
                setSelectedAttractionType(null);
                setAttractions(null);
                setLocation(null);
            }
        }
    }, [isFocused]);

    useEffect(() => {
        // Fetch data for AttractionsComponent whenever location changes
        if (location) {
            fetchAttractions(location, selectedAttractionType)
                .then(data => {
                    if (data) {
                        //console.log("DATA",data);
                        setAttractions(data); // Update the state with fetched attractions data
                    } else {
                        console.error('No attractions data received.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching attractions:', error);
                });
        }
    }, [location, selectedAttractionType]);


    return (
        <SafeAreaView style={[tw`flex-1 bg-white`, Platform.OS === 'android' && { paddingTop: Constants.statusBarHeight }]}>
            {/*<Text style={styles.heading}>Attractions</Text>*/}
            <View style={tw`flex-1`}>
                <View style={styles.autocompleteContainer}>
                    <GooglePlacesAutocomplete
                        styles={{
                            container: { flex: 0 },
                            textInput: { fontSize: 16, ...tw`rounded-lg justify-end items-center` },
                            listView: {...tw`rounded-lg`},
                        }}
                        placeholder={"Search a location"}
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

                {/* Horizontal scroller for Attractions */}
                <ScrollView style={styles.attractionContainer} horizontal showsHorizontalScrollIndicator={false}>
                    {attractionsOptions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.attractionSelectContainer}
                            onPress={() => handleAttractionTypePress(item.type)}>
                            <View style={styles.iconContainer}>
                                {item.library === MaterialIcons && (
                                    <MaterialIcons name={item.name} size={30} color="#FF6F61" />
                                )}
                                {item.library === FontAwesome6 && (
                                    <FontAwesome6 name={item.name} size={24} color="#FF6F61" />
                                )}
                                {item.library === FontAwesome5 && (
                                    <FontAwesome5 name={item.name} size={24} color="#FF6F61" />
                                )}
                            </View>
                            <Text style={styles.attractionsSelectText}>{item.displayName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {attractions && (
                    <AttractionsComponent attractions={attractions}/>
                )}

            </View>

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
       // flex: 1,
        marginTop: 50, // Adjust this value as needed to create space for Autocomplete
        maxHeight: 60,
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
    },
    iconContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AttractionsScreen;
