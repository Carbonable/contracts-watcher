/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useEffect, useState } from "react";
import { SlotURI } from "~/types/slotURI";
import { RMap, RMarker } from "maplibre-react-components";
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
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; 
    }
    return null;
};

export default function ProjectMap({ mapData }: ProjectMapProps) {
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

    return mapData.length !== 0 ? 
    <RMap
        initialCenter={locations[0] == undefined ? [0, 0] : [locations[0].coordinates[0], locations[0].coordinates[1]]}
        style={{ width: '100%', height: "1000px", overflowY: "hidden" }}
        mapStyle={"https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"}
        // mapStyle={"https://api.maptiler.com/maps/satellite/style.json?key=PuTLhnyXi7HCWhYtcyJc"}
    >
        {locations.map((item, index) => (
            <>
                <RMarker key={index} longitude={item.coordinates[0]} latitude={item.coordinates[1]}>
                    <CustomMarker item={item} />
                </RMarker>
            </>
        ))}
    </RMap> : <MapSkeleton />;
}
