const axios = require('axios');
import { GOOGLE_API_KEY } from '@env';

const fetchAttractions = async (latitude, longitude, radius = 5000, keyword = 'attractions') => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                key: GOOGLE_API_KEY,
                location: `${latitude},${longitude}`,
                radius: radius,
                keyword: keyword
            }
        });

        if (response.data.status === 'OK') {
            // Extract relevant information
            const attractions = response.data.results.map(attraction => ({
                name: attraction.name,
                vicinity: attraction.vicinity,
                rating: attraction.rating || 'Not available',
                types: attraction.types.join(', ')
            }));

            return attractions;
        } else {
            console.error('Error fetching attractions:', response.data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching attractions:', error.message);
        throw error;
    }
};

export { fetchAttractions };