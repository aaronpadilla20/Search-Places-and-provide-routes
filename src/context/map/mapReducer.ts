import type { MapState } from "./MapProvider"
import { Map, Marker } from 'maplibre-gl'

type MapAction =
    | { type: 'setMap', payload: Map }
    | { type: 'setMarker', payload: Marker[] }

export const mapReducer = (state: MapState, action: MapAction): MapState => {
    switch (action.type) {
        case 'setMap':
            return {
                ...state,
                isMapReady: true,
                map: action.payload
            }

        case 'setMarker':
            return {
                ...state,
                markers: action.payload
            }

        default:
            return state;
    }
}