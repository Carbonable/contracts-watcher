/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useEffect, useState, useRef } from "react";
import { SlotURI } from "~/types/slotURI";
import "maplibre-gl/dist/maplibre-gl.css";
import { RMap, RMarker } from "maplibre-react-components";
import maplibregl from "maplibre-gl";
import "maplibre-react-components/style.css";
import "maplibre-theme/modern.css";
import "maplibre-theme/icons.default.css";
// import { Link } from "@remix-run/react";

interface ProjectMapProps {
    mapData: SlotURI[];
    project: string;
    projectSlot: string;
    collectionId: string;
}

function filterByName(arr: SlotURI[]) {
    const uniqueNames = new Set();
    return arr.filter(item => {
        if (!uniqueNames.has(item.name)) {
            uniqueNames.add(item.name);
            return true;
        }
        return false;
    });
}


const geocodeLocation = async (location: string) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            location
        )}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [longitude, latitude]
    }
    return null;
};

export default function ProjectMap({ mapData, project,
    projectSlot,
    collectionId }: ProjectMapProps) {
    const mapRef = useRef<maplibregl.Map | null>(null);
    useEffect(() => {
        if (mapData) {
            console.log(filterByName(mapData));
        }
    }, [mapData])

    const [locations, setLocations] = useState<any[]>([]);



    useEffect(() => {
        const fetchCoordinates = async () => {
            const updatedData = await Promise.all(
                filterByName(mapData).map(async (item) => {
                    const countryAttribute = item?.attributes.find((attr: any) => attr.trait_type === "Country");
                    const coordinates = await geocodeLocation(countryAttribute?.value as string);
                    return { ...item, coordinates };

                })
            );
            console.log(updatedData, "Coordinates");
            setLocations(filterByName(updatedData));
        };

        fetchCoordinates();
    }, [mapData]);

    useEffect(() => {
        if (locations.length > 0 && mapRef.current) {
            const bounds = new maplibregl.LngLatBounds();

            locations.forEach((item) => {
                if (item.coordinates) {
                    bounds.extend(item.coordinates);
                }
            });

            mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
        }
    }, [locations]);

    return mapData.length !== 0 ? <RMap
        initialZoom={3}
        ref={mapRef}
        className="maplibregl-theme-classic"
        style={{ width: '100%', height: "600px" }}
        initialCenter={[6.4546, 46.1067]}
        scrollZoom={false}
        doubleClickZoom={false}
        mapStyle={"https://api.maptiler.com/maps/satellite/style.json?key=PuTLhnyXi7HCWhYtcyJc"}
    >
        <RMarker longitude={6.4546} latitude={46.1067} initialAnchor="bottom" />
        {locations.map((item) =>
            <>
                {console.log(item)}
                <RMarker onClick={ } longitude={item.coordinates[0]} latitude={item.coordinates[1]} initialAnchor="bottom" />
            </>
        )}
    </RMap> : null;
}
