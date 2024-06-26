import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { styles } from '../styles/CustomStyle';
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


const HomeScreen = () => {
//export default function HomeScreen(){
    const [errorMsg, setErrorMsg] = useState(null);
    const [originalLocation, setOriginalLocation] = useState(null);
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [startLocation, setStartLocation] = useState(null);
    const [guide, setGuide] = useState(false);
    const [route, setRoute] = useState(null);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);


    const mapRef = useRef(null); // moves the maps 'camera'

    const handleRouteData = (routeData) => {
        setStartLocation(routeData.start_location);
        setDestination(routeData.end_location);
    };

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

                    {/*{guide && route && (
                        <View style={styles.routeContainer}>
                            <Text style={styles.routeSummary}>Route Summary: {route.summary}</Text>
                            <Text style={styles.routeDistance}>Distance: {route.legs[0].distance.text}</Text>
                            <Text style={styles.routeDuration}>Duration: {route.legs[0].duration.text}</Text>
                        </View>
                    )}*/}
                </MapView>

            ) : (
                <Text>Loading map...</Text>
            )}
            {/*errorMsg && <Text>{errorMsg}</Text>*/}



            {guide && (
                //<View style={styles.directionsContainer}>
                <DirectionsComponent origin={startLocation} destination={destination}/>
                //</View>
            )}
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
            {/*<View style={styles.routesContainer}>
                <Text style={styles.routesHeader}>Routes:</Text>
                <FlatList
                    data={routes}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.routeItem}>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>*/}

            {/* Button to recenter */}
            {!guide && (
                <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                    <Ionicons name={"location"} size={20} color={"#FFF"}/>
                </TouchableOpacity>
            )}

        </View>
    );
};

export default HomeScreen;
