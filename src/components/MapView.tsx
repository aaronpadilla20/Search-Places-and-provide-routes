import { useContext, useLayoutEffect, useRef } from 'react';
import { PlacesContext, MapContext } from '../context';
import { Loading } from './';
import { Map } from 'maplibre-gl';

import "maplibre-gl/dist/maplibre-gl.css";
import '../styles.css'

const MAP_TILES_API_KEY = import.meta.env.VITE_MAPTILES_KEY


export const MapView = () => {
    const { isLoading, userLocation } = useContext(PlacesContext);
    const { setMap } = useContext(MapContext);
    const mapDiv = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isLoading) {
            const map = new Map({
                container: mapDiv.current!,
                style: `https://api.maptiler.com/maps/streets-v4-dark/style.json?key=${MAP_TILES_API_KEY}`,
                zoom: 14,
                center: userLocation,
                pitch: 60,
                bearing: 0
            });
            map.on("load", () => {
                map.addLayer({
                    id: "3d-buildings",
                    source: "openmaptiles",          // debe existir en tu style
                    "source-layer": "building",      // capa de edificios dentro del source
                    type: "fill-extrusion",
                    minzoom: 15,
                    paint: {
                        "fill-extrusion-color": "#aaa",
                        "fill-extrusion-height": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            15, 0,
                            16, ["get", "height"]   // altura real de OSM
                        ],
                        "fill-extrusion-base": ["get", "min_height"], // opcional
                        "fill-extrusion-opacity": 0.6
                    }
                });
            });
            map.touchZoomRotate.enable();  // gestos de móvil
            setMap(map)
        }
    }, [isLoading])

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <div
            ref={mapDiv}
            style={{
                height: '100vh',
                left: 0,
                position: 'fixed',
                top: 0,
                width: '100vw',
            }}
        >
            {userLocation?.join(',')}
        </div>
    );
};
