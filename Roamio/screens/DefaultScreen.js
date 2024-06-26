import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, FlatList, SafeAreaView, Text} from 'react-native';
import { styles } from '../styles/CustomStyle';
import tw from "tailwind-react-native-classnames";
import Constants from "expo-constants";
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import * as Location from 'expo-location';
import { GOOGLE_API_KEY } from '@env';
import {GooglePlacesAutocomplete, GooglePlaceDetail} from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { fetchDirections } from '../components/FetchDirectionsComponent';
import DirectionsComponent from '../components/DirectionsComponent';
import {StatusBar} from "expo-status-bar";
import MapComponent from "../components/MapComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from "@react-navigation/native";

const DefaultScreen = () => {

    const [currentPos, setCurrentPos] = useState(null)
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null)
    const [showSearch, setShowSearch] = useState(false);
    const [transportMode, setTransportMode] = useState('driving');
    const [startLocation, setStartLocation] = useState(null);
    const [guide, setGuide] = useState(false);
    const [userID, setUserID] = useState(null);
    const autocompleteRef = useRef(null);

    const isFocused = useIsFocused();
    useEffect(() => {
        // Retrieve userID from AsyncStorage and resets screen to default when clicking back on explore tab
        if (isFocused){
            const retrieveUserID = async () => {
                try {
                    const storedUserID = await AsyncStorage.getItem('userID');
                    if (storedUserID !== null) {
                        const parsedUserID = JSON.parse(storedUserID);
                        setUserID(parsedUserID);
                        //console.log(parsedUserID)
                    }

                } catch (error) {
                    console.error('Error retrieving userID:', error);
                }
            };
            // Clear the text in the Google Places Autocomplete search bar
            if (autocompleteRef.current) {
                autocompleteRef.current.setAddressText(''); // Set the value to an empty string
            }
            setOrigin(currentPos);
            setDestination(null);
            setShowSearch(false);
            setGuide(false);
            retrieveUserID();
        }
    }, [isFocused]);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                //setErrorMsg('Permission to access location was denied');
                // If permission is denied, set a default location (e.g., City University of London)
                setOrigin({
                    coords: {
                        latitude: 51.5280,
                        longitude: -0.1025,
                    },
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
            setCurrentPos(location)
            setOrigin(location);
            //console.log(location)
        };
        if (!currentPos) {
            getLocation();
        }
    }, []);

    const handleNewOrigin = (data, details = null) => {
        if (details && details.geometry && details.geometry.location) {
            const newOrigin = {
                coords: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                }
            };
            setOrigin(newOrigin);
        }
    }

    const handleTransportModeChange = (mode) => {
        setTransportMode(mode);
    };

    return(
        <SafeAreaView style={[tw`h-full bg-white`, Platform.OS === 'android' && { paddingTop: Constants.statusBarHeight }]}>
            <View style={styles.container}>
                {showSearch && (
                    <View style={tw`flex`}>
                        <GooglePlacesAutocomplete
                            styles={{
                                container: {
                                    flex:0,
                                },
                                textInput: {
                                    fontSize: 16,
                                },
                            }}
                            ref={autocompleteRef}
                            fetchDetails={true}
                            enablePoweredByContainer={false}
                            placeholder="Change starting location"
                            query={{
                                key: GOOGLE_API_KEY,
                                language: "en",
                                //components: "country:uk",
                                radius: "15000",
                                rankBy: "distance",
                                location: origin ? `${origin.coords.latitude}, ${origin.coords.longitude}` : null,
                                //position: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                            }}
                            onPress={handleNewOrigin}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={400}
                            minLength={2}
                        />
                    </View>
                )}

                <View style={tw`flex-1`[showSearch]}>
                    <GooglePlacesAutocomplete
                        styles={{
                            container: {
                                flex: 0,
                            },
                            textInput: {
                                fontSize: 16,
                            }
                        }}
                        ref={autocompleteRef}
                        placeholder={"Where do you want to go?"}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: "en",
                            //components: "country:uk",
                            radius: "15000",
                            rankBy: "distance",
                            location: origin ? `${origin.coords.latitude}, ${origin.coords.longitude}` : null,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={400}
                        minLength={2}
                        onPress={(data, details= null) => {
                            setDestination({
                                location: details?.geometry.location,
                            })
                            setShowSearch(true);
                            setStartLocation(origin.coords);
                            setGuide(true);
                        }}
                    />
                </View>

                <View style={styles.transportModeContainer}>
                    <TouchableOpacity
                        style={[styles.transportModeButton, transportMode === 'driving' && styles.selectedTransportMode]}
                        onPress={() => handleTransportModeChange('driving')}
                    >
                        <Ionicons name={"car"} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.transportModeButton, transportMode === 'walking' && styles.selectedTransportMode]}
                        onPress={() => handleTransportModeChange('walking')}
                    >
                        <Ionicons name={"walk"} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.transportModeButton, transportMode === 'transit' && styles.selectedTransportMode]}
                        onPress={() => handleTransportModeChange('transit')}
                    >
                        <Ionicons name={"train"} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.transportModeButton, transportMode === 'bicycling' && styles.selectedTransportMode]}
                        onPress={() => handleTransportModeChange('bicycling')}
                    >
                        <Ionicons name={"bicycle"} size={20} />
                    </TouchableOpacity>
                </View>
                <MapComponent currentPos={currentPos} origin={origin} destination={destination} />
                {guide && (
                    <DirectionsComponent origin={origin} destination={destination} transportMode={transportMode} userID={userID} />
                )}
            </View>
        </SafeAreaView>

    );
};
export default DefaultScreen;