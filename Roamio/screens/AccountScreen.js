import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


const AccountScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello, world!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AccountScreen;