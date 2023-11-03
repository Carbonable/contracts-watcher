import { useContractRead } from "@starknet-react/core";
import { getChecksumAddress, type Abi, num } from "starknet";
import MigrationContractsAbi from "./MigrationContractsAbi";
import { useProjectAbis } from "../ProjectAbisWrapper";

export default function MigationContracts({ migratorAddress, migratorAbi }: { migratorAddress: string, migratorAbi: Abi }) {
    const { oldNFTAddress } = useProjectAbis();
    const { data: dataSource, isError: isErrorSource, isLoading: isLoadingSource } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'source_address'
    });

    const { data: dataTarget, isError: isErrorTarget, isLoading: isLoadingTarget } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'target_address'
    });

    if (isLoadingSource || isLoadingTarget) {
        return (
            <div className="w-full flex justify-center">
                <div className="text-gray-400 text-xl font-bold">
                    Loading migration contracts...
                </div>
            </div>
        );
    }

    if (isErrorSource || isErrorTarget || dataSource === undefined || dataTarget === undefined || typeof dataSource !== 'bigint' || typeof dataTarget !== 'bigint' || oldNFTAddress === undefined ) {
        return (
            <div className="w-full flex justify-center">
                <div className="text-gray-400 text-xl font-bold">
                    Error loading migration contracts
                </div>
            </div>
        );
    }

    return (
        <MigrationContractsAbi
            sourceImplementationAddress={oldNFTAddress}
            sourceAddress={getChecksumAddress(num.toHex(dataSource))}
            targetAddress={getChecksumAddress(num.toHex(dataTarget))}
            migratorAddress={migratorAddress}
            migratorAbi={migratorAbi}
        />
    );
}