import { useContractRead } from "@starknet-react/core";
import { num, getChecksumAddress } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { useConfig } from "~/root";
import { ContractLinkComponent } from "~/components/common/LinkComponent";
import { parseFelt252 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function CertifierAccount() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    const title = "Certifier account";

    const { data, error, isLoading, isError } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_certifier',
        args: [slot]
    });

    const value = parseFelt252(data);

    if (isLoading || isError || value === undefined) {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (!isLoading && value === undefined)}
                error={error}
            />
        )
    }

    return (
        <ContractLinkComponent
            title={title}
            address={getChecksumAddress(num.toHex(value))}
            href={voyagerContractURL + getChecksumAddress(num.toHex(value))}
        />
    )
}
