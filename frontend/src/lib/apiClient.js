import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://devpost-hackathon-voicebite-backend.vercel.app/api';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const normalizedBaseUrl = (configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : DEFAULT_API_BASE_URL).replace(/\/$/, '');

export const apiClient = axios.create({
    baseURL: normalizedBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});
