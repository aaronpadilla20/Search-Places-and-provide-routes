import polyline from '@mapbox/polyline'

export const polyline6Decoder = (encoded_string: string): number[][] => {
    const encoded = encoded_string;
    const coordinates = polyline.decode(encoded, 6).map(([lat, lon]) => [lon, lat])
    console.log({ coordinates });
    return coordinates;
}
