import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageViewer = () => {
    const [storageData, setStorageData] = useState([]);

    useEffect(() => {
        const fetchStorageData = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const data = await AsyncStorage.multiGet(keys);
                setStorageData(data);
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchStorageData();
    }, []);

    return (
        <View>
            <Text>Items in AsyncStorage:</Text>
            {storageData.map(([key, value]) => (
                <View key={key}>
                    <Text>Key: {key}</Text>
                    <Text>Value: {value}</Text>
                </View>
            ))}
        </View>
    );
};

export default AsyncStorageViewer;
