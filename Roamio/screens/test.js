import * as React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env';


const App = () => {
    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search"
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'en', // language of the results
                }}
                onPress={(data, details = null) => console.log(data)}
                onFail={(error) => console.error(error)}
                requestUrl={{
                    url:
                        'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                    useOnPlatform: 'web',
                }} // this in only required for use on the web. See https://git.io/JflFv more for details.
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#ecf0f1',
    },
});

export default App;
