import React from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView} from 'react-native';
import tw from "tailwind-react-native-classnames";
import { Ionicons } from '@expo/vector-icons';
import AttractionsComponent from "../components/AttractionsComponent";


const AttractionsScreen = () => {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Text style={styles.heading}>Attractions</Text>
            <AttractionsComponent/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default AttractionsScreen;