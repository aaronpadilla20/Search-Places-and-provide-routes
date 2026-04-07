import axios from 'axios'

const directionsApi = axios.create({
    baseURL: 'https://router.project-osrm.org/route/v1/driving',
    params: {
        alternatives: false,
        geometries: 'polyline6',
        overview: 'simplified',
        steps: false
    }
})

export default directionsApi;