/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Link } from "@remix-run/react";
import { memo, useEffect } from "react";
import { SlotURI } from "~/types/slotURI";
import { SVG } from '@svgdotjs/svg.js';

const ICON = `M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`;

interface CustomMarkerProps {
    item?: SlotURI
}

function CustomMarker({ item }: CustomMarkerProps) {
    const id = item?.name.toString().toLowerCase().replace(' ', '_');
    const image = item?.image ? item?.image.replaceAll('%23', '#') :
            item?.image ? item?.image.replaceAll('%23', '#') : null;

    useEffect(() => {
        // Function to modify SVGs
        function modifySVG(containerId: string) {
            if (!image) {
                return;
            }

            const container = SVG().addTo(`#${containerId}`);
            const svgToDisplay = container.svg(image, true);
            const prefix = containerId + '_';

            // Dev only remove the first child because of strict mode double rendering
            if (svgToDisplay.children().length > 1) {
                svgToDisplay.children()[0].remove();
            }

            svgToDisplay.find('[id]').each((element) => {
                element.id(prefix + element.id());
            });

            svgToDisplay.find('[fill]').each((element) => {
                element.fill(element.fill().replace('url(#', 'url(#' + prefix));
            });

            svgToDisplay.find('[stroke]').each((element) => {
                element.stroke(element.stroke().replace('url(#', 'url(#' + prefix));
            });

            svgToDisplay.find('[filter]').each((element) => {
                const currentFilter = element.attr('filter');
                element.attr('filter', currentFilter.replace('url(#', 'url(#' + prefix));
            });

            svgToDisplay.find('[clip-path]').each((element) => {
                const currentClipPath = element.attr('clip-path');
                element.attr('clip-path', currentClipPath.replace('url(#', 'url(#' + prefix));
            });

            svgToDisplay.find('[mask]').each((element) => {
                const currentMask = element.attr('mask');
                element.attr('mask', currentMask.replace('url(#', 'url(#' + prefix));
            });

            svgToDisplay.find('[href]').each((element) => {
                const currentHref = element.attr('href');
                if (currentHref.startsWith('#')) {
                    element.attr('href', currentHref.replace('#', '#' + prefix));
                }
            });
        }

        // Modify the SVGs
        modifySVG(`svg_${id}`);
    }, []);

    return (
        <>
            <Link className="relative link-container" to={`/collections/${item?.collectionId}/projects/${item?.project}/${item?.projectSlot}`}>
                <div
                    className="custom-marker-img"
                    id={`svg_${id}`}
                />
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