import { useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { type Abi } from "starknet";
import { fetchAbi } from "~/utils/starknet";
import MigrationComponent from "./MigrationComponent";

export default function MigrationContractsAbi({ migratorAddress, migratorAbi, sourceAddress, sourceImplementationAddress, targetAddress }: { migratorAddress: string, migratorAbi: Abi, sourceAddress: string, sourceImplementationAddress: string, targetAddress: string }) {
    const { provider } = useProvider();
    const [sourceContractAbi, setSourceContractAbi] = useState<Abi|undefined>(undefined);
    const [targetContractAbi, setTargetContractAbi] = useState<Abi|undefined>(undefined);

    useEffect(() => {
        async function fetchContractAbi() {
            const abiResult = await fetchAbi(provider, sourceImplementationAddress);
            setSourceContractAbi(abiResult);
        }

        fetchContractAbi();
    }, [provider, sourceImplementationAddress]);

    useEffect(() => {
        async function fetchContractAbi() {
            const abiResult = await fetchAbi(provider, targetAddress);
            setTargetContractAbi(abiResult);
        }

        fetchContractAbi();
    }, [provider, targetAddress]);

    if (sourceContractAbi === undefined || targetContractAbi === undefined) {
        return (
            <div>Loading migration contracts abi...</div>
        )
    }

    return (
        <MigrationComponent
            migratorAddress={migratorAddress}
            migratorAbi={migratorAbi}
            sourceAddress={sourceAddress}
            sourceAbi={sourceContractAbi}
            targetAddress={targetAddress}
            targetAbi={targetContractAbi}
        />
    )
}