import React, {useEffect, useRef, useState} from 'react';
import AccountScreen from './AccountScreen';
import {View, Text, StyleSheet, Button, Dimensions, TouchableOpacity} from 'react-native';
import MapView, {Marker, LatLng, PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from 'expo-location';
import { GOOGLE_API_KEY } from '@env';
import {GooglePlacesAutocomplete, GooglePlaceDetail} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';

//const HomeScreen = () => {
export default function HomeScreen(){
    const [originalLocation, setOriginalLocation] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const mapRef = useRef(null); // moves the maps 'camera'


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
            setLocation(originalLocation);
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
            setOriginalLocation(location);
            setLocation(location);
        })();
    }, []);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.002, //Zoom levels
                        longitudeDelta: 0.002,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Current location"
                    />
                </MapView>
            ) : (
                <Text>Loading...</Text>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}



            <View style={styles.searchBar}>
                <GooglePlacesAutocomplete
                    styles={{
                        listView: styles.searchResultsList,
                        //textInput:styles.searchInput,
                    }}
                    GooglePlacesDetailsQuery={{ fields: "geometry" }}
                    fetchDetails={true}
                    placeholder="Where do you want to go?"
                    query={{
                        key: GOOGLE_API_KEY,
                        language: "en",
                        radius: 30000,
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
                                latitudeDelta: 0.002,
                                longitudeDelta: 0.002,
                            };
                            mapRef?.current?.animateToRegion(moveMap, 500);
                      //  }
                    }}
                    onFail={error => console.log(error)}
                    onNotFound={() => console.log('no results')}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={200}
                />
            </View>

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
        //borderRadius: 8,
        top: Constants.statusBarHeight + 25,
        flex: 0,
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
});

//export default HomeScreen;
/*
export default function HomeScreen() {
    const cameraMove = async (position: LatLng) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, {duration: 1000});
        }
    };
}
*/

/*
* <View style={styles.searchBar}>
                <GooglePlacesAutocomplete
                    placeholder="Where do you want to go?"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        console.log(data, details);
                        // You can handle the selected location here
                    }}
                    onFail={(error) => console.error(error)}
                    requestUrl={{
                        url:
                            'https://maps.googleapis.com/maps/api',
                    }}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: "en",
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={200}
                    //styles={{container: { flex: 0, }}}
                    styles={{textInput: styles.searchInput}}
                    renderRow={(rowData) => { const title = rowData.structured_formatting.main_text; const address = rowData.structured_formatting.secondary_text; console.log('title & address:', title, address); return ( <View> <Text style={{ fontSize: 14 }}>{title}</Text> <Text style={{ fontSize: 14 }}>{address}</Text> </View> ); }}
                />

            </View>
            * */