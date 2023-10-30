import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function Name() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'name'
    });

    if (error) {
        return (
            <div>Error loading project name...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Name is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Name"
            value={shortString.decodeShortString(num.toHex(data)).toString()}

        />
    )
}