import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { getChecksumAddress, num } from "starknet";
import { ContractLinkComponent } from "~/components/common/LinkComponent";
import { useConfig } from "~/root";

export default function SourceAddress() {
    const { migratorAbi, migratorAddress } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    const { data, error } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'source_address'
    });

    if (error) {
        return (
            <div>Error loading migrator source address...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Migrator source address is undefined...</div>
        )
    }

    return (
        <ContractLinkComponent
            title="Source address"
            address={getChecksumAddress(num.toHex(data))}
            href={voyagerContractURL + getChecksumAddress(num.toHex(data))}
        />
    )
}