import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import tw from "tailwind-react-native-classnames";
import { Ionicons } from '@expo/vector-icons';
import {WEATHER_API_KEY, GOOGLE_API_KEY} from '@env';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";


const WeatherScreen = () => {
    const [currentPos, setCurrentPos] = useState(null);
    const [initialFetch, setInitialFetch] = useState(false);
    const [fetchWeather, setFetchWeather] = useState(false);
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const autocompleteRef = useRef(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${WEATHER_API_KEY}&units=metric`;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@4x.png`;

    const isFocused = useIsFocused();
    useEffect(() => {
        // Resets when user clicks on weather screen tab
        if (isFocused) {
            handleMyLocationPress();
            if (autocompleteRef.current) {
                autocompleteRef.current.setAddressText(''); // Set the value to an empty string
            }
        }
    }, [isFocused]);


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
    }, [location, initialFetch, fetchWeather, weatherData]);

    // Handle press event for My Location button
    const handleMyLocationPress = () => {
        setFetchWeather(true); // Set fetchWeather to true to trigger weather data fetching
        if (autocompleteRef.current) {
            autocompleteRef.current.setAddressText(''); // Set the value to an empty string
        }
    };

//<Text style={styles.text}>Weather screen</Text>
    return (
        //<SafeAreaView style={[tw`flex-1`, {backgroundColor: "#FF6F61"}]}>
        <SafeAreaView style={[tw`flex-1 bg-gray-500`]}>
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
                    setFetchWeather(true);
                }}
            />
            {/*<TouchableOpacity onPress={handleMyLocationPress} style={[tw`bg-white items-center rounded-lg`, styles.locationButton]}/>*/}
            <TouchableOpacity onPress={handleMyLocationPress} style={[styles.locationButton]}>
                <View style={tw`flex-row items-center `}>
                    <Ionicons name={"navigate"} size={20} color={"#FFF"} />
                    <Text style={{ color: '#FFF', marginLeft: 5 }}>Current location</Text>
                </View>
            </TouchableOpacity>



            {weatherData ? (
                    <View style={styles.weatherContainer}>
                        <Text style={styles.text}>{weatherData.name}</Text>
                        <Text style={styles.text}>{Math.floor(weatherData.main.temp)}°C</Text>
                        {weatherData.weather.map(weather => (
                            <View key={weather.id} style={styles.weatherContainer}>
                                <Text style={styles.text}>{weather.main}</Text>
                                {/* <Text>Description: {weather.description}</Text>*/}
                            </View>
                        ))}
                        <Image source={{ uri: iconUrl }} style={{ width: 100, height: 100 }} />
                        <Text>Max temperature: {Math.floor(weatherData.main.temp_max)}°C</Text>
                        <Text>Min temperature: {Math.floor(weatherData.main.temp_min)}°C</Text>
                        <Text>Feels like: {Math.floor(weatherData.main.feels_like)}°C</Text>
                        <Text>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
                        <Text>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>

                    </View>
                ):(
                    <View style={[tw`items-center`]}>
                        <Text>Fetching weather...</Text>
                    </View>
                )}


        </SafeAreaView>
    );
};
//{weatherData && currentPos &&(
const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        //marginVertical: 20,
    },
    weatherContainer: {
        paddingTop:10,
        alignItems: 'center',
    },
    locationButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#FF6F61",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
    },
});

export default WeatherScreen;