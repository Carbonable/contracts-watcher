import { useContractRead } from "@starknet-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import { shortString } from "starknet";
import { type SlotURI } from "~/types/slotURI";
import { useProjectAbis } from "./ProjectAbisWrapper";
import ProjectCardSkeleton from "../common/ProjectCardSkeleton";

const SlotURIContext = createContext<SlotURI>({} as SlotURI);
export default function SlotURIWrapper({ children }: { children: React.ReactNode }) {
    const [slotUri, setSlotUri] = useState<SlotURI|undefined>(undefined);
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const { data, isLoading, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'slot_uri',
        args: [parseInt(slot)],
        parseResult: false
    });

    useEffect(() => {
        if (data === undefined) { return; }

        const array = data as Array<string>;

        array.shift();

        if (array.length > 0) {
            setSlotUri(JSON.parse(array.map(shortString.decodeShortString).join('').replace("data:application/json,", "")));
        }
    }, [data]);

    if (isLoading || slotUri === undefined) {
        return (
            // <div>Loading slot_uri...</div>
            <ProjectCardSkeleton/>
        )
    }

    if (error) {
        return (
            <div>Error: {error.message}</div>
        )
    }

    if (slotUri === undefined) { return null; }

    return (
        <SlotURIContext.Provider value={ slotUri }>
            { children }
        </SlotURIContext.Provider>
    );
}

export function useSlotURI() {
    return useContext(SlotURIContext);
}