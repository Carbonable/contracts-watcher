import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { getChecksumAddress, num } from "starknet";
import { ContractLinkComponent } from "~/components/common/LinkComponent";
import { useConfig } from "~/root";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function SourceAddress() {
    const { migratorAbi, migratorAddress } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    const { data, error, isError, isLoading } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'source_address'
    });

    const title = "Source address";

    if (isLoading || isError || data === undefined || typeof data !== 'bigint') {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (data === undefined || typeof data !== 'bigint')}
                error={error}
            />
        )
    }

    return (
        <ContractLinkComponent
            title={title}
            address={getChecksumAddress(num.toHex(data))}
            href={voyagerContractURL + getChecksumAddress(num.toHex(data))}
        />
    )
}