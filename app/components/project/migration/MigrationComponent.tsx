import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { uint256 } from "starknet";
import { bigIntToNumber } from "~/utils/starknet";
import { DECIMALS } from "~/types/config";
import LabelComponent from "~/components/common/LabelComponent";

export default function MigrationComponent({ migratorAbi, migratorAddress, sourceAddress, sourceAbi, targetAddress, targetAbi }: 
    { migratorAbi: any, migratorAddress: string, sourceAddress: string, sourceAbi: any, targetAddress: string, targetAbi: any }) {
        const { slot } = useProjectAbis();

        const { data: totalValue, isError: isErrorTotalValue, isLoading: isLoadingTotalValue } = useContractRead({
            address: targetAddress,
            abi: targetAbi,
            functionName: 'total_value',
            args: [slot]
        });

        const { data: projectValue, isError: isErrorProjectValue, isLoading: isLoadingProjectValue } = useContractRead({
            address: targetAddress,
            abi: targetAbi,
            functionName: 'get_project_value',
            args: [slot]
        });

        const { data: migratorValue, isError: isErrorMigratorValue, isLoading: isLoadingMigratorValue } = useContractRead({
            address: migratorAddress,
            abi: migratorAbi,
            functionName: 'value'
        });

        const { data: totalSupply, isError: isErrorTotalSupply, isLoading: isLoadingTotalSupply } = useContractRead({
            address: sourceAddress,
            abi: sourceAbi,
            functionName: 'totalSupply'
        });

        if (isLoadingTotalValue || isLoadingProjectValue || isLoadingMigratorValue || isLoadingTotalSupply) {
            return (
                <div className="w-full flex justify-center">
                    <div className="text-gray-400 text-xl font-bold">
                        Loading migration status...
                    </div>
                </div>
            );
        }

        if (isErrorTotalValue || isErrorProjectValue || isErrorMigratorValue || isErrorTotalSupply) {
            return (
                <div className="w-full flex justify-center">
                    <div className="text-gray-400 text-xl font-bold">
                        Error loading migration status
                    </div>
                </div>
            );
        }

        if (totalValue === undefined || projectValue === undefined || migratorValue === undefined || totalSupply === undefined || typeof totalValue !== 'bigint' || typeof projectValue !== 'bigint' || typeof migratorValue !== 'bigint' || typeof totalSupply !== 'object') {
            return (
                <div className="w-full flex justify-center">
                    <div className="text-gray-400 text-xl font-bold">
                        Status is undefined
                    </div>
                </div>
            );
        }

        const totalSupplyValue = parseInt(uint256.uint256ToBN((totalSupply as any).totalSupply).toString());
        const numberOfNFTs = bigIntToNumber(projectValue) / bigIntToNumber(migratorValue);
        const numberOfJunoNFTs = numberOfNFTs - totalSupplyValue - (bigIntToNumber(totalValue) / bigIntToNumber(migratorValue));

        return (
            <>
                <LabelComponent
                    title="Juno"
                    value={`${numberOfJunoNFTs} / ${numberOfNFTs} NFTs`}
                />
                <LabelComponent
                    title="Starknet ERC721"
                    value={`${totalSupplyValue} / ${numberOfNFTs} NFTs`}
                />
                <LabelComponent
                    title="Starknet ERC3525"
                    value={`${bigIntToNumber(totalValue) * Math.pow(10, -DECIMALS)} / ${bigIntToNumber(projectValue) * Math.pow(10, -DECIMALS)} shares`}
                />
            </>
        )
}