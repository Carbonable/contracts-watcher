import { useContractRead } from "@starknet-react/core";
import { num, getChecksumAddress } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { useConfig } from "~/root";
import { ContractLinkComponent } from "~/components/common/LinkComponent";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function CertifierAccount() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    const { data, error, isLoading, isError } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_certifier',
        args: [slot]
    });

    const title = "Certifier account";

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