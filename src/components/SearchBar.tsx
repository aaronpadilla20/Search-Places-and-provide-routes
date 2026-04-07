import { useContext, useRef, type ChangeEvent } from "react";
import { MapContext, PlacesContext } from "../context";
import { SearchResults } from "./SearchResults";

export const SearchBar = () => {

    // Para usar este tipado instala npm install --save-dev @types/node y declara el tipo de "node" en 
    // tsconfig.app.json
    const debounceRef = useRef<NodeJS.Timeout>(null);
    const { searchPlacesByTerm, query, setQuery } = useContext(PlacesContext);
    const { map } = useContext(MapContext);

    const clearRoute = () => {
        const sourceId = 'RouteString';
        if (map?.getLayer(sourceId)) map?.removeLayer(sourceId);
        if (map?.getSource(sourceId)) map?.removeSource(sourceId);
    }

    const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setQuery(newValue);
        clearRoute();

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            setQuery(event.target.value);
            searchPlacesByTerm(event.target.value)
        }, 350)
    }

    return (
        <div className="search-container">
            <input
                type="text"
                className="form-control"
                placeholder="Busca lugares de interes cercanos a ti"
                value={query}
                onChange={onQueryChanged}
            />
            <SearchResults />
        </div>
    );
};
