import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function Symbol() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'symbol'
    });

    if (error) {
        return (
            <div>Error loading project symbol...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Symbol is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Symbol"
            value={shortString.decodeShortString(num.toHex(data)).toString()}

        />
    )
}