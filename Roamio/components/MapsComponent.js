import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const fetchDirections = async (origin, destination) => {
    try {
        // Convert origin and destination objects to strings
        const originStr = `${origin.latitude},${origin.longitude}`;
        const destinationStr = `${destination.latitude},${destination.longitude}`;

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${GOOGLE_API_KEY}&travelmode=walking`
        );
        //console.log(response.data);
        if (response.data.status === 'OK') {
            const steps = response.data.routes[0].legs[0].steps.map(step => ({
                instructions: step.html_instructions.replace(/<[^>]*>?/gm, ''),
            }));
            const distance = response.data.routes[0].legs[0].distance.text;
            const duration = response.data.routes[0].legs[0].duration.text;
            //console.log({ directions: steps, distance, duration })
            return { directions: steps, distance, duration };
        } else {
            // Log a generic message if no routes were found
            console.error('No routes found between the specified origin and destination.');
            return null;
        }
    } catch (error) {
        // Log and throw the error if an exception occurred during the request
        console.error('Error fetching directions:', error);
        throw error;
    }
};

export { fetchDirections };
