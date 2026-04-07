import axios from 'axios'

const searchApi = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org/search',
    params: {
        limit: 5,
        format: 'json',
        'accept-language': 'es',
    }
})

export default searchApi;