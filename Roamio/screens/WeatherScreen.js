import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
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
    const [currentWeatherData, setCurrentWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const autocompleteRef = useRef(null);
    const isFocused = useIsFocused();

    const currentWeatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.latitude}&lon=${location?.longitude}&appid=${WEATHER_API_KEY}&units=metric`;
    const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@4x.png`;

    useEffect(() => {
       // console.log("currentWeatherData:", currentWeatherData);
      //  console.log("forecastData:", forecastData);
    }, [currentWeatherData, forecastData]);

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
                const response = await fetch(currentWeatherurl);
                const data = await response.json();
                setCurrentWeatherData(data);
                setInitialFetch(true);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        const fetchForecastData = async () => {
            try {
                const response = await fetch(forecastUrl);
                const data = await response.json();
                setForecastData(data);
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };

        if (location && (!initialFetch || (initialFetch && fetchWeather))) {
            fetchWeatherData();
            fetchForecastData();
            setFetchWeather(false);
        }
    }, [location, initialFetch, fetchWeather]);

    const formatHourlyForecastData = () => {
        if (!forecastData || !forecastData.list) return [];
        const hourlyForecasts = {};
        const today = new Date();
        forecastData.list.forEach((forecast) => {
            const forecastDate = new Date(forecast.dt * 1000);
            if (forecastDate.getDate() === today.getDate()) {
                const time = forecastDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });
                hourlyForecasts[time] = {
                    time,
                    temperature: Math.floor(forecast.main.temp),
                    icon: forecast.weather[0].icon,
                };
            }
        });
        return Object.values(hourlyForecasts);
    };

    const renderHourlyForecast = (hourlyForecasts) => {
        return (
            <View key={hourlyForecasts.time} style={styles.forecastItem}>
                <Text>{hourlyForecasts.time}</Text>
                <Image source={{ uri: iconUrl(hourlyForecasts.icon) }} style={styles.weatherIcon} />
                <Text>{hourlyForecasts.temperature}°C</Text>
            </View>
        );
    };

    const formatNextDaysForecastData = () => {
        if (!forecastData || !forecastData.list) return [];
        const dailyForecasts = {};
        const today = new Date();
        forecastData.list.forEach((forecast) => {
            const forecastDate = new Date(forecast.dt * 1000);
            const date = forecastDate.toLocaleDateString();
            let day;
            if (forecastDate.getDate() === today.getDate()) {
                day = "Today";
            }
            else if (forecastDate.getDate() === today.getDate() + 1) {
                day = "Tomorrow";
            } else {
                day = forecastDate.toLocaleDateString('en', { weekday: 'long' });
            }
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: day,
                    forecasts: [],
                };
            }
            const time = forecastDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });
            dailyForecasts[date].forecasts.push({
                time: time.toLowerCase(),
                temperature: Math.floor(forecast.main.temp),
                icon: forecast.weather[0].icon,
            });
        });
        return Object.values(dailyForecasts);
    };

    const renderNextDaysForecast = (forecast) => {
        return (
            <View key={forecast.date} style={styles.forecastContainer}>
                <Text style={styles.dateText}>{forecast.date}</Text>
                <View style={styles.forecastItemContainer}>
                    {forecast.forecasts.map((item, index) => (
                        <View key={index} style={styles.forecastItem}>
                            <Text>{item.time}</Text>
                            <Image source={{ uri: iconUrl(item.icon) }} style={styles.weatherIcon} />
                            <Text>{item.temperature}°C</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const handleMyLocationPress = () => {
        setCurrentPos(null); // Reset currentPos to trigger location update
        setCurrentWeatherData(null); // Reset weather data
        setForecastData(null); // Reset forecast data
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

                {currentWeatherData && forecastData ? (
                    <ScrollView style={styles.weatherContainer}>
                        <View style={styles.currenWeatherContainer}>
                            <Text style={styles.text}>{currentWeatherData.name}</Text>
                            <Text style={styles.text}>{Math.floor(currentWeatherData.main.temp)}°C</Text>
                            {currentWeatherData.weather.map(weather => (
                                <View key={weather.id}>
                                    <Text style={styles.text}>{weather.main}</Text>
                                    <Image source={{ uri: iconUrl(weather.icon) }} style={{ width: 100, height: 100 }} />
                                </View>
                            ))}
                            <Text>Max temperature: {Math.floor(currentWeatherData.main.temp_max)}°C</Text>
                            <Text>Min temperature: {Math.floor(currentWeatherData.main.temp_min)}°C</Text>
                            <Text>Feels like: {Math.floor(currentWeatherData.main.feels_like)}°C</Text>
                            <Text>Sunrise: {new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            <Text>Sunset: {new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>

                        {/*Current day forecast view
                        <View style={styles.forecastContainer}>
                            <Text style={styles.forecastText}>Todays Forecast</Text>
                            {formatHourlyForecastData().map((hourlyForecasts) => renderHourlyForecast(hourlyForecasts))}
                        </View>*/}


                        {/*Forecast view*/}
                        <View style={styles.forecastContainer}>
                            <Text style={styles.forecastText}>Forecast</Text>
                            {formatNextDaysForecastData().map((forecast) => renderNextDaysForecast(forecast))}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={[tw`flex-1 items-center my-20`]}>
                        <Text>Fetching weather...</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity onPress={handleMyLocationPress} style={[styles.locationButton]}>
                <View style={tw`flex-row items-center `}>
                    <Ionicons name={"navigate"} size={20} color={"#000"} />
                    <Text style={{ color: '#000', marginLeft: 5 }}>Current location</Text>
                </View>
            </TouchableOpacity>
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
        marginVertical: 65,
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
    currenWeatherContainer: {
        alignItems: 'center',
    },
    forecastContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    forecastText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    forecastItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    forecastItem: {
        alignItems: 'center',
    },
    weatherIcon: {
        width: 50,
        height: 50,
    },
});

export default WeatherScreen;
