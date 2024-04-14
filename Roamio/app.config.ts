import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: 'Roamio',
    name: 'Roamio',
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.croon',
        config: {
            googleMapsApiKey: process.env.GOOGLE_CLOUD_API_KEY,
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF',
        },
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_CLOUD_API_KEY,
            },
        },
    },
});