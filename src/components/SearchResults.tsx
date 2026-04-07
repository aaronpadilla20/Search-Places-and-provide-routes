import { useContext, useEffect, useState } from "react";
import { MapContext, PlacesContext } from "../context";
import { LoadingPlaces } from './';
import type { Place } from "../interfaces/places";


export const SearchResults = () => {
    const { places, isLoadingplaces, userLocation, setQuery } = useContext(PlacesContext);
    const { map, getRouteBetweenPoints } = useContext(MapContext);
    const [showResults, setShowResults] = useState(true);

    useEffect(() => {
        setShowResults(true);
    }, [places])

    const [activeId, setActiveId] = useState<number | null>(null)

    const onPlaceClick = (place: Place) => {
        const lat = Number(place.lat)
        const lon = Number(place.lon);
        setActiveId(place.place_id)
        map?.flyTo({
            zoom: 14,
            center: [lon, lat]
        })
    }

    const getRoute = (place: Place) => {
        if (!userLocation) return;

        const lon = Number(place.lon);
        const lat = Number(place.lat);
        const end: [number, number] = [lon, lat]

        getRouteBetweenPoints(userLocation, end);
        setQuery('');
        setShowResults(false);
    }

    if (isLoadingplaces) {
        return <LoadingPlaces />
    }

    if (places.length === 0 || !showResults) return <></>

    return (
        <ul className="list-group mt-3">

            {
                places.map((place) => (
                    <li
                        key={place.place_id}
                        className={`
                            list-group-item list-group-item-action pointer 
                            ${activeId === place.place_id ? 'active' : ''}
                        `}
                        onClick={() => onPlaceClick(place)}
                    >
                        <h6>{place.name}</h6>
                        <p
                            className="text-muted"
                            style={{
                                fontSize: '12px'
                            }}
                        >
                            {place.display_name}
                        </p>
                        <button
                            className={`btn btn-sm ${activeId === place.place_id ? 'btn-outline-light' : 'btn-outline-primary'} `}
                            onClick={() => getRoute(place)}
                        >
                            Direcciones
                        </button>
                    </li>
                ))
            }
        </ul>
    );
};
