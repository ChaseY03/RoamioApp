import { StyleSheet, Dimensions } from 'react-native';
import Constants from "expo-constants";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        //justifyContent: 'center',
        //alignItems: 'center',
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
        top: Constants.statusBarHeight,
    },
    startVisible: {
        top: Constants.statusBarHeight + 80,
    },
    startLocationSearchBar: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        top: Constants.statusBarHeight,
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
    directionsContainer: {
        marginTop: 200,
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    routeContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    routeSummary: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    routeDistance: {
        fontSize: 16,
        marginBottom: 3,
    },
    routeDuration: {
        fontSize: 16,
        marginBottom: 3,
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
});


/*
*
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
        top: Constants.statusBarHeight,
    },
    startVisible: {
        top: Constants.statusBarHeight + 80, // Adjust according to the height of the destination search bar
    },
    startLocationSearchBar: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        top: Constants.statusBarHeight, // Adjust according to the height of the destination search bar
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
    directionsContainer: {
        top: 200, // Example margin to separate from search bars
        //backgroundColor: '#f0f0f0',
        padding: 10,
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
    settingsButton: {
        position: "absolute",
        top: Constants.statusBarHeight, // Adjust this value as needed
        right: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex:0,
    },
});
* */