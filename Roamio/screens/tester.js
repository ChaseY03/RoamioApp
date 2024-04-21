import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {WEATHER_API_KEY, GOOGLE_API_KEY} from '@env';
import {fetchWeather} from "../components/FetchWeatherComponent";
import {fetchAttractions} from "../components/FetchAttractionsComponent";
import * as Location from "expo-location";
const MyComponent = () => {
    const autocompleteRef = useRef(null);
    const [currentPos, setCurrentPos] = useState(null);
    const [initialFetch, setInitialFetch] = useState(false);
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);



    useEffect(() => {
        // Fetch data for AttractionsComponent whenever location changes
        fetchWeather(location)
            .then(data => {
                if (data) {
                    setWeatherData(data);
                    //console.log(data)
                } else {
                    console.error('No weather data received.');
                }
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
            });

    }, [location]);

    return (
        <SafeAreaView style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={"Search for a city"}
                query={{
                    key: GOOGLE_API_KEY,
                    language: "en",
                    types: "(cities)",
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                ref={autocompleteRef}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
                minLength={2}
                onPress={(data, details = null) => {
                    //console.log('Selected location:', details);
                    if (data.description === "My Location") {
                        setLocation({
                            name: "My Location",
                            latitude: currentPos.coords.latitude,
                            longitude: currentPos.coords.longitude,
                        });
                    } else {
                        setLocation({
                            name: details?.name,
                            latitude: details?.geometry.location.lat,
                            longitude: details?.geometry.location.lng,
                        });
                    }
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MyComponent;
