import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { getChecksumAddress, num } from "starknet";
import { ContractLinkComponent } from "~/components/common/LinkComponent";
import { useConfig } from "~/root";

export default function TargetAddress() {
    const { migratorAbi, migratorAddress } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    const { data, error } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'target_address'
    });

    if (error) {
        return (
            <div>Error loading migrator target address...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Migrator target address is undefined...</div>
        )
    }

    return (
        <ContractLinkComponent
            title="Target address"
            address={getChecksumAddress(num.toHex(data))}
            href={voyagerContractURL + getChecksumAddress(num.toHex(data))}
        />
    )
}