import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const fetchDirections = async (origin, destination, transportMode) => {
    try {
        // Convert origin and destination objects to strings
        const originStr = `${origin.coords.latitude},${origin.coords.longitude}`;
        const destinationStr = `${destination.location.lat},${destination.location.lng}`;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${transportMode}&key=${GOOGLE_API_KEY}`
        );
        if (response.data.status === 'OK') {
            const steps = response.data.routes[0].legs[0].steps.map(step => ({
                instructions: step.html_instructions.replace(/<[^>]*>?/gm, ''),
                distance: step.distance.text,
                duration: step.duration.text
            }));
            const distance = response.data.routes[0].legs[0].distance.text;
            const duration = response.data.routes[0].legs[0].duration.text;

            let stops = [];
            if (transportMode === 'transit') {
                // If transport mode is transit, retrieve stops
                const legs = response.data.routes[0].legs[0];
                const transitSteps = legs.steps.filter(step => step.travel_mode === 'TRANSIT');
                stops = transitSteps.map(step => {
                    if (step.transit_details) {
                        return {
                            stopCount: step.transit_details.num_stops,
                            departureStop: step.transit_details.departure_stop.name,
                            arrivalStop: step.transit_details.arrival_stop.name,
                            lineName: step.transit_details.line.short_name || step.transit_details.line.name,
                            vehicleType: step.transit_details.line.vehicle.type,
                            duration: step.duration.text,
                        };
                    } else {
                        return {
                            stopCount: 0,
                            departureStop: '',
                            arrivalStop: '',
                            lineName: '',
                            vehicleType: '',
                        };
                    }
                });
            }
            return { directions: steps, stops, distance, duration };
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
