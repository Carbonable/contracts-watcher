import { useConfig } from "~/root";
import LinkComponent from "../common/LinkComponent";
import { useProjectAbis } from "./ProjectAbisWrapper";
import { useSlotURI } from "./SlotURI";

export default function ProjectInfo() {
    const { slot } = useProjectAbis();
    const slotURI = useSlotURI();
    const { isPublic } = useConfig();

    return (
        <>
            <div className="text-3xl uppercase font-bold mb-1">
                {slotURI.name}
                <span className="text-xl text-neutral-300 ml-2 font-light">(slot {slot})</span>
            </div>
            <div className="text-neutral-100">{slotURI.description}</div>
            <div className="mt-4">
                <LinkComponent href={slotURI.external_url} title="External URL" />
            </div>
            <div className="mt-2">
                <LinkComponent href={slotURI.youtube_url} title="Youtube URL" />
            </div>
            { !isPublic &&
                <div className="mt-2">
                    <LinkComponent href={slotURI.banner_image_url} title="Banner Image URL" />
                </div>
            }
        </>
    )
}
