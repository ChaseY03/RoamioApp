import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const fetchAttractions = async (location, selectedAttractionType, radius = 5000, keyword = 'attractions') => {
    try {
        const { latitude, longitude } = location;
        const params = {
            key: GOOGLE_API_KEY,
            location: `${latitude},${longitude}`,
            radius: radius,
            keyword: keyword,
        };
        //console.log(selectedAttractionType)
        // Add type parameter only if selectedAttractionType is not null or undefined
        if (selectedAttractionType) {
            params.type = selectedAttractionType;
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params });


        if (response.data.status === 'OK') {
            const attractions = await Promise.all(response.data.results.map(async (attraction) => {
                // Get attraction image
                const photos = await getAttractionImage(attraction.place_id);
                const imageUrl = photos ? photos : null;

                return {
                    name: attraction.name,
                    vicinity: attraction.vicinity,
                    rating: attraction.rating || 'Not available',
                    types: attraction.types.join(', '),
                    image: imageUrl,
                };
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
const getAttractionImage = async (placeId) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                key: GOOGLE_API_KEY,
                place_id: placeId,
                fields: 'photos',
            }
        });

        if (response.data.status === 'OK' && response.data.result.photos && response.data.result.photos.length > 0) {
            const photoReference = response.data.result.photos[0].photo_reference;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
        } else {
            console.error('Error fetching image for place:', response.data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching image for place:', error.message);
        throw error;
    }
};

export { fetchAttractions };
