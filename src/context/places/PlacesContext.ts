import { createContext } from 'react';
import type { Place } from '../../interfaces/places';

export interface PlacesContextProps {
    isLoading: boolean;
    isLoadingplaces: boolean;
    places: Place[];
    query: string;
    userLocation?: [number, number];

    // Methods
    searchPlacesByTerm: (query: string) => Promise<Place[]>;
    setQuery: (query: string) => void
}


export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps);


