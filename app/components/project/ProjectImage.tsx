import { useEffect } from "react";
import { SVG } from '@svgdotjs/svg.js';
import { useSlotURI } from "./SlotURI";

export default function ProjectImage() {
    const slotURI = useSlotURI();
    const id = slotURI.name.toString().toLowerCase().replace(' ', '_');
    
    const image = 
        slotURI.image_data ? slotURI.image_data.replaceAll('%23', '#') : 
            slotURI.image ?slotURI.image.replaceAll('%23', '#'): null;

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
        <div
            id={`svg_${id}`}
        />
    )
}