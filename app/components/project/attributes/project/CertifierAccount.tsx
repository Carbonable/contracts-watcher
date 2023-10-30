import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, getChecksumAddress } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function CertifierAccount() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_certifier',
        args: [slot]
    });

    if (error) {
        return (
            <div>Error loading project certifier account...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Certifier account is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Certifier account"
            value={getChecksumAddress(num.toHex(data))}

        />
    )
}