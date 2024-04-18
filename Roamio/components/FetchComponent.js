import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const fetchDirections = async (origin, destination) => {
    try {
        // Convert origin and destination objects to strings
        const originStr = `${origin.coords.latitude},${origin.coords.longitude}`;
        const destinationStr = `${destination.location.lat},${destination.location.lng}`;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${GOOGLE_API_KEY}`
        );
        console.log("fetch",originStr)
        console.log("fetch",destinationStr)
        console.log(response.data);
        if (response.data.status === 'OK') {
            //const steps = response.data.routes[0].legs[0].steps.map(step => ({
           //     instructions: step.html_instructions.replace(/<[^>]*>?/gm, ''),
            //}));
            const steps = response.data.routes[0].legs[0].steps.map(step => ({
                instructions: step.html_instructions.replace(/<[^>]*>?/gm, ''),
                distance: step.distance.text,
                duration: step.duration.text
            }));
            const distance = response.data.routes[0].legs[0].distance.text;
            const duration = response.data.routes[0].legs[0].duration.text;
            //console.log({ directions: steps, distance, duration })
            return { directions: steps, distance, duration };
        } else {
            console.error('No routes found between the specified origin and destination.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
};

export { fetchDirections };
