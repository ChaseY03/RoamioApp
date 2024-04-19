import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {WEATHER_API_KEY, GOOGLE_API_KEY} from '@env';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";

//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric

const WeatherScreen = () => {
    const [currentPos, setCurrentPos] = useState(null);
    const [initialFetch, setInitialFetch] = useState(false);
    const [fetchWeather, setFetchWeather] = useState(false);
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${WEATHER_API_KEY}&units=metric`;

    const isFocused = useIsFocused();
    useEffect(() => {
        // Resets when user clicks on weather screen tab
        if (isFocused) {

        }
    }, [isFocused]);

    useEffect(() => {
        console.log("location details:", location);
    }, [location]);


    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let currentUserPosition = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
            setCurrentPos(currentUserPosition);
            setLocation(currentUserPosition.coords);
        };

        getLocation();

    }, [currentPos]);


    // Effect to fetch weather data when location changes
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setWeatherData(data);
                setInitialFetch(true);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        if (location && (!initialFetch || initialFetch && fetchWeather)) {
            fetchWeatherData();
            setFetchWeather(false); // Reset fetchWeather to false after fetching
        }
    }, [location, initialFetch, fetchWeather]);

    // Handle press event for My Location button
    const handleMyLocationPress = () => {
        console.log('Current location:', currentPos);
        setFetchWeather(true); // Set fetchWeather to true to trigger weather data fetching
    };

    useEffect(() => {
        console.log('Weather data:', weatherData);
    }, [weatherData]);

//<Text style={styles.text}>Weather screen</Text>
    return (
        <SafeAreaView style={[tw`flex-1`, {backgroundColor: "#FF6F61"}]}>
            <GooglePlacesAutocomplete
                styles={{
                    container: { flex: 0, ...tw`px-5 rounded-lg`},
                    textInput: { fontSize: 16, ...tw` rounded-lg justify-end items-center` },
                    listView: {...tw`rounded-lg`},
                }}
                //ref={autocompleteRef}
                placeholder={"Search for a city"}
                query={{
                    key: GOOGLE_API_KEY,
                    language: "en",
                    types: "(cities)",
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
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
                    setFetchWeather(true);
                }}
                renderLeftButton={ () => (
                    <TouchableOpacity onPress={handleMyLocationPress}>
                        <Text>My Location</Text>
                    </TouchableOpacity>
                    )}
            />

            <View style={styles.weatherContainer}>
                {weatherData && (
                    <>
                        <Text>Name: {weatherData.name}</Text>
                        <Text>Current temperature: {weatherData.main.temp}°C</Text>
                        <Text>Max temperature: {weatherData.main.temp_max}°C</Text>
                        <Text>Min temperature: {weatherData.main.temp_min}°C</Text>
                        <Text>Feels like: {weatherData.main.feels_like}°C</Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};
//{weatherData && currentPos &&(
const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    weatherContainer: {
        alignItems: 'center',
    },
});

export default WeatherScreen;