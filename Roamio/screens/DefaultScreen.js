import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, FlatList, SafeAreaView} from 'react-native';
import { styles } from '../styles/HomeStyle';
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
import Map from "../components/Map";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from "@react-navigation/native";

const DefaultScreen = () => {

    const [currentPos, setCurrentPos] = useState(null)
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null)
    const [showSearch, setShowSearch] = useState(false);
    const [startLocation, setStartLocation] = useState(null);
    const [guide, setGuide] = useState(false);
    const [userID, setUserID] = useState(null);

    const isFocused = useIsFocused();
    useEffect(() => {
        // Retrieve userID from AsyncStorage
        if (isFocused){
            const retrieveUserID = async () => {
                try {
                    const storedUserID = await AsyncStorage.getItem('userID');
                    if (storedUserID !== null) {
                        const parsedUserID = JSON.parse(storedUserID);
                        setUserID(parsedUserID);
                        //console.log(parsedUserID)
                    }
                    setGuide(false)
                } catch (error) {
                    console.error('Error retrieving userID:', error);
                }
            };

            retrieveUserID();
        }
    }, [isFocused]);

    useEffect(() => {
        (async () => {
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
        })();
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

    useEffect(() => {
        // console.log('Destination updated:', destination);
    }, [destination]);
    useEffect(() => {
        // console.log('Origin updated:', origin);
    }, [origin]);
    useEffect(() => {
        // console.log('Current pos updated:', currentPos);
    }, [currentPos]);

    return(
        <SafeAreaView style={tw`h-full bg-white`}>
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
                                listView: {
                                    flex: 0,
                                }
                            }}
                            fetchDetails={true}
                            enablePoweredByContainer={false}
                            //placeholder="Change starting location"
                            placeholder="Current location"
                            query={{
                                key: GOOGLE_API_KEY,
                                language: "en",
                                components: "country:uk",
                                radius: "15000",
                                rankBy: "distance",
                                //location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                                //position: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                            }}
                            // onPress={((data, details = null) => {
                            //  setOrigin({
                            //       location: details?.geometry.location,
                            //  })
                            // })}
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
                        placeholder={"Where do you want to go?"}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: "en",
                            components: "country:uk",
                            radius: "15000",
                            rankBy: "distance",
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


                <Map currentPos={currentPos} origin={origin} destination={destination} />
                {guide && (
                    <DirectionsComponent origin={origin} destination={destination} userID={userID} />
                )}
            </View>
        </SafeAreaView>

    );
};
export default DefaultScreen;