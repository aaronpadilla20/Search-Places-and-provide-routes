import type { Place } from "../../interfaces/places";
import type { PlacesState } from "./PlacesProvider";

type PlacesAction =
    | { type: 'setUserLocation', payload: [number, number] }
    | { type: 'setLoadingPlaces' }
    | { type: 'setPlaces', payload: Place[] }
    | { type: 'setQuery', payload: string }

export const placesReducer = (state: PlacesState, action: PlacesAction): PlacesState => {
    switch (action.type) {
        case 'setUserLocation':
            return {
                ...state,
                isLoading: false,
                userLocation: action.payload
            }

        case 'setLoadingPlaces':
            return {
                ...state,
                isLoadingplaces: true,
                places: []
            }

        case 'setPlaces':
            return {
                ...state,
                isLoadingplaces: false,
                places: action.payload
            }

        case 'setQuery':
            return {
                ...state,
                query: action.payload
            }

        default:
            return state;
    }
}