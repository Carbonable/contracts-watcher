import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function ValueDecimals() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'value_decimals'
    });

    if (error) {
        return (
            <div>Error loading project value decimals...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Value decimals is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Value decimals"
            value={shortString.decodeShortString(num.toHex(data)).toString()}

        />
    )
}