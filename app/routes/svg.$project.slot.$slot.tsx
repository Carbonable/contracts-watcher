import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContractRead, useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import type { Abi } from "starknet";
import { fetchAbi } from "~/utils/starknet";

export async function loader({params}: LoaderFunctionArgs) {
    return json({ project: params.project, slot: params.slot });
}

export default function Index() {
    const { project, slot } = useLoaderData();
    const { provider } = useProvider();
    const [abi, setAbi] = useState<Abi|undefined>(undefined);
    const slotURI = useContractRead({
        address: project,
        abi,
        functionName: 'slot_uri',
        args: [parseInt(slot)]
    })

    useEffect(() => {
        async function fetchAbiWrapper() {
            const abiResult = await fetchAbi(provider, project);
            setAbi(abiResult);
        }
        fetchAbiWrapper();
    }, [provider, project]);

    console.log(slotURI)

    return (
        <>
        </>
    );
}