import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import tw from "tailwind-react-native-classnames";
import { Ionicons } from '@expo/vector-icons';
import { WEATHER_API_KEY, GOOGLE_API_KEY } from '@env';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";

const WeatherScreen = () => {
    const [currentPos, setCurrentPos] = useState(null);
    const [initialFetch, setInitialFetch] = useState(false);
    const [fetchWeather, setFetchWeather] = useState(false);
    const [location, setLocation] = useState(null);
    const [iconUrl, setIconUrl] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const autocompleteRef = useRef(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let currentUserPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setCurrentPos(currentUserPosition); // Update current position
            setLocation(currentUserPosition.coords); // Update location
        };

        if (isFocused && !currentPos) { // Fetch location only when focused and currentPos is null
            getLocation();
        }
    }, [isFocused, currentPos]);

    useEffect(() => {
        if (currentPos) { // Fetch weather data only when currentPos is available
            setFetchWeather(true);
        }
    }, [currentPos]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${WEATHER_API_KEY}&units=metric`;
                const response = await fetch(url);
                const data = await response.json();
                setWeatherData(data);
                setInitialFetch(true);

                // Define iconUrl here when weatherData is available
                const iconUrl = data.weather ? `https://openweathermap.org/img/wn/${data.weather[0]?.icon}@4x.png` : null;
                setIconUrl(iconUrl);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        if (location && (!initialFetch || (initialFetch && fetchWeather))) {
            fetchWeatherData();
            setFetchWeather(false);
        }
    }, [location, initialFetch, fetchWeather]);


    const handleMyLocationPress = () => {
        setCurrentPos(null); // Reset currentPos to trigger location update
        setWeatherData(null); // Reset weather data
        setInitialFetch(false); // Reset initial fetch
        setFetchWeather(true); // Trigger weather fetch
        if (autocompleteRef.current) {
            autocompleteRef.current.setAddressText('');
        }
    };

    return (
        <SafeAreaView style={[tw`flex-1 bg-gray-300`, Platform.OS === 'android' && { paddingTop: Constants.statusBarHeight }]}>
            <View style={tw`flex-1`}>
                <View style={styles.autocompleteContainer}>
                    <GooglePlacesAutocomplete
                        styles={{
                            container: { flex: 0, ...tw`px-5 rounded-lg` },
                            textInput: { fontSize: 16, ...tw` rounded-lg justify-end items-center` },
                            listView: { ...tw`rounded-lg` },
                        }}
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
                            if (data.description === "My Location") {
                                setCurrentPos(null); // Reset currentPos to trigger location update
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
                    />
                </View>
                <TouchableOpacity onPress={handleMyLocationPress} style={[styles.locationButton]}>
                    <View style={tw`flex-row items-center `}>
                        <Ionicons name={"navigate"} size={20} color={"#000"} />
                        <Text style={{ color: '#000', marginLeft: 5 }}>Current location</Text>
                    </View>
                </TouchableOpacity>
                {weatherData ? (
                    <View style={styles.weatherContainer}>
                        <Text style={styles.text}>{weatherData.name}</Text>
                        <Text style={styles.text}>{Math.floor(weatherData.main.temp)}°C</Text>
                        {weatherData.weather.map(weather => (
                            <View key={weather.id}>
                                <Text style={styles.text}>{weather.main}</Text>
                                <Image source={{ uri: iconUrl }} style={{ width: 100, height: 100 }} />
                            </View>
                        ))}
                        <Text>Max temperature: {Math.floor(weatherData.main.temp_max)}°C</Text>
                        <Text>Min temperature: {Math.floor(weatherData.main.temp_min)}°C</Text>
                        <Text>Feels like: {Math.floor(weatherData.main.feels_like)}°C</Text>
                        <Text>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Text>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                ) : (
                    <View style={[tw`flex-1 items-center my-20`]}>
                        <Text>Fetching weather...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    weatherContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 5,
    },
    locationButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
    },
});

export default WeatherScreen;
