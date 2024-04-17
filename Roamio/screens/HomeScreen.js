import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import Constants from "expo-constants";
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import * as Location from 'expo-location';
import { GOOGLE_API_KEY } from '@env';
import {GooglePlacesAutocomplete, GooglePlaceDetail} from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { fetchDirections } from '../components/MapsComponent';
import DirectionsComponent from '../components/DirectionsComponent';
import {StatusBar} from "expo-status-bar";


//const HomeScreen = () => {
export default function HomeScreen(){
    const [errorMsg, setErrorMsg] = useState(null);
    const [originalLocation, setOriginalLocation] = useState(null);
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [startLocation, setStartLocation] = useState(null);
    const [guide, setGuide] = useState(false);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const mapRef = useRef(null); // moves the maps 'camera'
/*
    if (startLocation && destination) {
        const start = startLocation;
        const end = destination;
        const travelMode = "DRIVING";
        //const start = '51.5280,-0.1025'; // Example: City University of London
        //const end = '51.5074,-0.1278'; // Example: Buckingham Palace
        console.log("start and end: " , start, end);

        fetchDirections(start, end, travelMode)
            .then(steps => {
                setGuide(true);
                console.log('Directions:', steps);
                // Use the steps to display navigation instructions in your app
            })
            .catch(error => {
                console.error('Failed to fetch directions:', error);
                // Handle the error gracefully in your app
            });
    }*/

    const handleRecenter = () => {
        if (mapRef.current && originalLocation) {
            const { latitude, longitude } = originalLocation.coords;
            const region = {
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            };
            mapRef.current.animateToRegion(region, 500);
            if (!destination) { // Only set location if destination marker is not set
                setLocation(originalLocation);
            }
        }
    };

    const handleNewStartLocation = (data, details = null) => {
        if (details) {
            const { lat, lng } = details.geometry.location;
            setStartLocation({ latitude: lat, longitude: lng });
            const moveMap = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
            };
            mapRef?.current?.animateToRegion(moveMap, 500);
        } else {
            // If no details are provided, use the current location as the start location
            setStartLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }

    };


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                //setErrorMsg('Permission to access location was denied');
                // If permission is denied, set a default location (e.g., City University of London)
                setLocation({
                    coords: {
                        latitude: 51.5280,
                        longitude: -0.1025,
                    },
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            setLocation(location);
            setOriginalLocation(location);
            if (originalLocation && originalLocation.coords) {
                setStartLocation(originalLocation.coords);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    showsUserLocation
                    //showsMyLocationButton
                    toolbarEnabled={false}
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.003, //Zoom levels
                        longitudeDelta: 0.003,
                    }}
                >
                    {startLocation && (
                        <Marker
                            coordinate={{
                                latitude: startLocation.latitude,
                                longitude: startLocation.longitude,
                            }}
                            title="Starting Location"
                            pinColor={"#008000"} // Green color for start location marker
                        />
                    )}
                    {destination && (
                        <Marker
                            coordinate={{
                                latitude: destination.latitude,
                                longitude: destination.longitude,
                            }}
                            title="Destination"
                        />
                    )}
                    {/*
                    {originalLocation && (
                        <Marker
                            coordinate={{
                                latitude: originalLocation.coords.latitude,
                                longitude: originalLocation.coords.longitude,
                            }}
                            title="Current location"
                            pinColor={"#5D78B2"}
                        >
                            <Ionicons name={"ellipse"} size={30} color={"#5D78B2"}/>
                        </Marker>

                    )}
                    */}

                    {destination && startLocation && (
                        <MapViewDirections apikey={GOOGLE_API_KEY}
                                           origin={startLocation ? `${startLocation.latitude},${startLocation.longitude}` : `${location.coords.latitude},${location.coords.longitude}`}
                                           destination={`${destination.latitude},${destination.longitude}`}
                                           strokeWidth={5}
                                           strokeColor="#FF6F61"
                                           optimizeWaypoints={true}
                            //waypoints={waypoints}
                                           precision="high"
                        />

                    )}

                    {guide && (
                        <View style={styles.directionsContainer}>
                            <DirectionsComponent origin={startLocation} destination={destination} travelMode="WALKING"/>
                        </View>
                    )}

                </MapView>
            ) : (
                <Text>Loading map...</Text>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}

            <View style={[styles.searchBar ,showSearch ? styles.startVisible : null]}>
                <GooglePlacesAutocomplete
                    styles={{
                        listView: styles.searchResultsList,
                        //textInput:styles.searchInput,
                    }}
                    GooglePlacesDetailsQuery={{ fields: "geometry"}}
                    fetchDetails={true}
                    placeholder="Where do you want to go?"
                    query={{
                        key: GOOGLE_API_KEY,
                        language: "en",
                        components: "country:uk",
                        radius: "15000",
                        rankBy: "distance",
                        location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                        position: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                    }}
                    onPress={(data, details = null ) =>{
                        // console.log(data, details);
                        // console.log(JSON.stringify(details?.geometry?.location));
                        //  if (details) {
                        const { lat, lng } = details.geometry.location;
                        setLocation({
                            coords: {
                                latitude: lat,
                                longitude: lng,
                            },
                        });
                        const moveMap = {
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.003,
                            longitudeDelta: 0.003,
                        };
                        mapRef?.current?.animateToRegion(moveMap, 500);
                        setDestination({latitude: lat, longitude: lng});
                        setShowSearch(true);
                        setStartLocation(originalLocation.coords);
                        setGuide(true);
                       // setDistance();
                        //setDuration();
                        //  }
                    }}
                    onFail={error => console.log(error)}
                    onNotFound={() => console.log('no results')}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={200}
                />
            </View>

            {showSearch && (
                <View style={styles.startLocationSearchBar}>
                    <GooglePlacesAutocomplete
                        styles={{
                            listView: styles.searchResultsList,
                            //textInput:styles.searchInput,
                        }}
                        GooglePlacesDetailsQuery={{ fields: "geometry"}}
                        fetchDetails={true}
                        placeholder="Change starting location"
                        query={{
                            key: GOOGLE_API_KEY,
                            language: "en",
                            components: "country:uk",
                            radius: "15000",
                            rankBy: "distance",
                            location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                            position: location ? `${location.coords.latitude}, ${location.coords.longitude}` : null,
                        }}
                        /*
                        onPress={(data, details = null ) =>{
                            // console.log(data, details);
                            // console.log(JSON.stringify(details?.geometry?.location));
                            //  if (details) {
                            const { lat, lng } = details.geometry.location;
                            setLocation({
                                coords: {
                                    latitude: lat,
                                    longitude: lng,
                                },
                            });
                            const moveMap = {
                                latitude: lat,
                                longitude: lng,
                                latitudeDelta: 0.002,
                                longitudeDelta: 0.002,
                            };
                            mapRef?.current?.animateToRegion(moveMap, 500);
                            setDestination({latitude: lat, longitude: lng});
                            //  }
                        }}*/
                        onPress={handleNewStartLocation}
                        onFail={error => console.log(error)}
                        onNotFound={() => console.log('no results')}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={200}
                    />
                </View>
            )}
            {/* Button to recenter */}
            <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                <Ionicons name={"location"} size={20} color={"#FFF"}/>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    searchBar: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        top: Constants.statusBarHeight,
    },
    startVisible: {
        top: Constants.statusBarHeight + 80, // Adjust according to the height of the destination search bar
    },
    startLocationSearchBar: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        top: Constants.statusBarHeight, // Adjust according to the height of the destination search bar
    },
    searchInput:{
        borderColor: "#888",
        borderWidth: 1,
        fontSize: 16,
        color: '#333',
    },
    searchResultsList:{
        backgroundColor: "#FFF",
    },
    directionsContainer: {
        top: 200, // Example margin to separate from search bars
        //backgroundColor: '#f0f0f0',
        padding: 10,
    },
    transportBar:{
        width: "100%",
        position: 'absolute',
        left: 0,
        right: 0,
        height: Constants.statusBarHeight + 20, // Adjust height as needed
        backgroundColor: 'white',
        paddingHorizontal: 20, // Adjust padding as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    recenterButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#FF6F61",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
    },
    recenterButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    settingsButton: {
        position: "absolute",
        top: Constants.statusBarHeight, // Adjust this value as needed
        right: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex:0,
    },
});
