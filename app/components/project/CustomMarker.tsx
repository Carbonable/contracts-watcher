/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Link } from "@remix-run/react";
import { memo } from "react";
import { SlotURI } from "~/types/slotURI";

const ICON = `M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`;

interface CustomMarkerProps {
    item?: SlotURI
}

function CustomMarker({ item }: CustomMarkerProps) {

    return (
        <>
            <Link className="relative link-container" to={`/collections/${item?.collectionId}/projects/${item?.project}/${item?.projectSlot}`}>
                <svg
                    height={50}
                    width={50}
                    viewBox="0 0 384 512"
                    style={{ cursor: "pointer", fill: "#1ED760" }}
                >
                    <path d={ICON} />
                </svg>
            </Link>
        </>
    );
}
export default memo(CustomMarker);