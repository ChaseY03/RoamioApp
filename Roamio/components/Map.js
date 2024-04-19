import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, FlatList} from 'react-native';
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
import { fetchDirections } from './FetchDirectionsComponent';
import DirectionsComponent from '../components/DirectionsComponent';
import {StatusBar} from "expo-status-bar";
import {useIsFocused} from "@react-navigation/native";

const Map = ({ currentPos, origin, destination }) => {
    const mapRef = useRef(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        // Resets maps back to users current position when they click back to the home/explore page
        if (isFocused){
            if (currentPos) {
                const { latitude, longitude } = currentPos.coords;
                const region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                };
                mapRef.current.animateToRegion(region, 500);
            }
        }
    }, [isFocused]);

    const handleRecenter = () => {
        if (mapRef.current && currentPos) {
            const { latitude, longitude } = currentPos.coords;
            const region = {
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            };
            mapRef.current.animateToRegion(region, 500);
        }
    };

    useEffect(() => {
        if (!origin || !destination || !mapRef.current) return;
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'] ,{
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        });
    }, [origin, destination])

    return (
        <View style={tw`flex-1 relative`}>
            {origin?.coords ? (
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    toolbarEnabled={false}
                    ref={mapRef}
                    style={tw`flex-1`}
                    provider={PROVIDER_GOOGLE}
                    //mapType={"mutedStandard"}
                    initialRegion={{
                        latitude: origin.coords.latitude,
                        longitude: origin.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    {destination && destination?.location && (
                        <Marker
                            coordinate={{
                                latitude: destination.location.lat,
                                longitude: destination.location.lng,
                            }}
                            title="Destination"
                            identifier={'destination'}
                        />
                    )}

                    {origin && origin?.coords && (
                        <Marker
                            coordinate={{
                                latitude: origin.coords.latitude,
                                longitude: origin.coords.longitude,
                            }}
                            title="Start"
                            identifier={'origin'}
                        />
                    )}

                    {origin && destination && (
                        <MapViewDirections
                            apikey={GOOGLE_API_KEY}
                            origin={{
                                latitude: origin.coords.latitude,
                                longitude: origin.coords.longitude,
                            }}
                            destination={{
                                latitude: destination.location.lat,
                                longitude: destination.location.lng,
                            }}
                            strokeWidth={3}
                            strokeColor="#FF6F61"
                            precision={"high"}
                        />
                    )}

                </MapView>
            ):(
                <View style={[tw`items-center`]}>
                    <Text>Loading map...</Text>
                </View>
            )}
            <TouchableOpacity
                style={styles.recenterButton}
                onPress={handleRecenter}
            >
                <Ionicons name="location" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

export default Map;


