type Viewbox = string;

export const createViewbox = (
    lat: number,
    lon: number,
    km: number
): Viewbox => {

    // 1° lat ≈ 111 km
    const latDelta = km / 111;

    // 1° lon ≈ 111 km * cos(lat)
    const lonDelta = km / (111 * Math.cos(lat * Math.PI / 180));

    const minLon = lon - lonDelta;
    const maxLon = lon + lonDelta;
    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;

    return [minLon, maxLat, maxLon, minLat].join(',');
};