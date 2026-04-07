import { useEffect, useReducer, type PropsWithChildren } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { searchApi } from "../../apis";
import { createViewbox } from "../../helpers/createViewbox";
import type { Place } from "../../interfaces/places";

export interface PlacesState {
    isLoading: boolean;
    isLoadingplaces: boolean;
    places: Place[];
    query: string;
    userLocation?: [number, number];
}

const INITIAL_STATE: PlacesState = {
    isLoading: true,
    isLoadingplaces: false,
    places: [],
    query: '',
    userLocation: undefined,
}


export const PlacesProvider = ({ children }: PropsWithChildren) => {

    const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

    useEffect(() => {
        getUserLocation()
            .then(lngLat => dispatch({ type: 'setUserLocation', payload: lngLat }))
    }, [])

    const searchPlacesByTerm = async (query: string): Promise<Place[]> => {
        if (query.length === 0) {
            dispatch({ type: 'setPlaces', payload: [] })
            return [];
        }

        if (!state.userLocation) throw new Error('No hay ubicacion del usuario');

        dispatch({ type: 'setLoadingPlaces' })

        const [lon, lat] = state.userLocation;

        // Obtiene las dimensiones considerando 5km hacia cada lado y considerando
        // linea recta no considera calles ni rutas raras
        const viewbox = createViewbox(lat, lon, 10)

        const resp = await searchApi.get<Place[]>('', {
            params: {
                amenity: query,
                viewbox,
                bounded: 1
            }
        })

        dispatch({ type: 'setPlaces', payload: resp.data })
        return resp.data;
    }

    const setQuery = (query: string) => {
        dispatch({ type: 'setQuery', payload: query })
    }

    return (
        <PlacesContext.Provider value={{
            ...state,

            // Methods
            searchPlacesByTerm,
            setQuery
        }}>
            {children}
        </PlacesContext.Provider>
    );
};
