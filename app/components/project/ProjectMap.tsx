/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useEffect, useState, useRef } from "react";
import { SlotURI } from "~/types/slotURI";
import "maplibre-gl/dist/maplibre-gl.css";
import { RMap, RMarker } from "maplibre-react-components";
import maplibregl from "maplibre-gl";
import "maplibre-react-components/style.css";
import "maplibre-theme/modern.css";
import "maplibre-theme/icons.default.css";
import CustomMarker from "./CustomMarker";
import MapSkeleton from "../common/MapSkeleton";

interface ProjectMapProps {
    mapData: SlotURI[];
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
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [longitude, latitude]
    }
    return null;
};

export default function ProjectMap({ mapData }: ProjectMapProps) {
    const mapRef = useRef<maplibregl.Map | null>(null);

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
        initialCenter={locations[0] == undefined ? [0, 0] : [locations[0].coordinates[0], locations[0].coordinates[1]]}
        style={{ width: '100%', height: "800px", overflowY: "hidden" }}
        mapStyle={"https://api.maptiler.com/maps/satellite/style.json?key=PuTLhnyXi7HCWhYtcyJc"}
    >
        {locations.map((item) =>
            <>
                return mapData.length !== 0 ? (
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <RMap
                        initialCenter={locations[0] == undefined ? [0, 0] : [locations[0].coordinates[0], locations[0].coordinates[1]]}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=PuTLhnyXi7HCWhYtcyJc"
                    >
                        {locations.map((item, index) => (
                            <>
                            <RMarker longitude={item.coordinates[0]} latitude={item.coordinates[1]}>
                                <CustomMarker item={item} />
                            </RMarker>
                            </>
                        ))}
                    </RMap>
                </div>
                ) : (
                <MapSkeleton />
                );
            </>
        )}
    </RMap> : <MapSkeleton />;
}
