import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import tw from "tailwind-react-native-classnames";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from "@react-navigation/native";

const SavedLocationsScreen = () => {
    const [savedLocations, setSavedLocations] = useState([]);
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
                    //console.log("savedPage id",parsedUserID)
                }
                else {
                    setUserID(null);
                    setSavedLocations([]);
                }
            } catch (error) {
                console.error('Error retrieving userID:', error);
            }
        };
        retrieveUserID();
        }
    }, [isFocused]);




    const renderItem = ({ item }) => (
        console.log("rendering"),
        <View style={styles.item}>
            <Text>{item.locationName}</Text>
            {/* Render other details of the saved location */}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {userID ? (
                <View>
                    <Text style={styles.heading}>Saved Locations</Text>
                    <FlatList
                        data={savedLocations}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()} // Assuming each saved location has a unique id
                    />
                </View>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text>Login to save locations</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default SavedLocationsScreen;
