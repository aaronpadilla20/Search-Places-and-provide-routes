import { useContext, useEffect, useReducer, type PropsWithChildren } from 'react';
import { LngLatBounds, Map, Marker, Popup, type GeoJSONSourceSpecification } from 'maplibre-gl'
import { MapContext } from './MapContext';
import { mapReducer } from './mapReducer';
import { PlacesContext } from '../places/PlacesContext';
import { directionsApi } from '../../apis';
import type { DirectionsResponse } from '../../interfaces/directions';
import { polyline6Decoder } from '../../helpers';

export interface MapState {
    isMapReady: boolean;
    map?: Map;
    markers: Marker[];
}

const Initial_State: MapState = {
    isMapReady: false,
    map: undefined,
    markers: [],
}

export const MapProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(mapReducer, Initial_State)
    const { places } = useContext(PlacesContext);

    useEffect(() => {
        state.markers.forEach(marker => marker.remove());
        const newMarkers: Marker[] = [];

        for (const place of places) {
            const lat = Number(place.lat);
            const lon = Number(place.lon);
            const popUp = new Popup()
                .setHTML(`
                    <h6>${place.name}</h6>
                    <p>${place.display_name}</p>    
                `)
            const newMarker = new Marker()
                .setPopup(popUp)
                .setLngLat([lon, lat])
                .addTo(state.map!);
            newMarkers.push(newMarker);
        }

        // TODO - Limpiar Polyline

        dispatch({ type: 'setMarker', payload: newMarkers })
    }, [places])

    const setMap = (map: Map) => {

        const myLocationPopUp = new Popup()
            .setHTML(`
                <h4>Aqui estoy</h4>
                <p>En algun lugar del mundo</p>
            `)

        new Marker({
            color: '#61DAFB'
        })
            .setLngLat(map.getCenter())
            .setPopup(myLocationPopUp)
            .addTo(map);

        // Abrir el popup inmediatamente
        myLocationPopUp.addTo(map).setLngLat(map.getCenter());

        dispatch({ type: 'setMap', payload: map })
    }

    const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {
        const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`);
        const { distance, duration, geometry: geometryEncoded } = resp.data.routes[0];
        const coordinates = polyline6Decoder(geometryEncoded);

        let kms = distance / 1000;
        kms = Math.round(kms * 100);
        kms /= 100;

        const minutes = Math.floor(duration / 60);
        console.log({ minutes })

        const bounds = new LngLatBounds(
            start,
            start
        )

        for (const coord of coordinates) {
            const newCoord: [number, number] = [coord[0], coord[1]];
            bounds.extend(newCoord);
        }

        state.map?.setPitch(0);
        state.map?.fitBounds(bounds, {
            padding: 40
        });

        // Polyline
        const sourceData: GeoJSONSourceSpecification = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates
                        }
                    }
                ]
            }
        }

        if (state.map?.getLayer('RouteString')) {
            state.map?.removeLayer('RouteString');
            state.map?.removeSource('RouteString');
        }

        state.map?.addSource('RouteString', sourceData);
        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'white',
                'line-width': 5
            }
        })
    }

    return (
        <MapContext.Provider value={{
            ...state,

            // Methods
            setMap,
            getRouteBetweenPoints
        }}>
            {children}
        </MapContext.Provider>
    );
};
