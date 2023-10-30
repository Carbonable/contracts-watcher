import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function TotalValue() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'total_value',
        args: [slot]
    });

    if (error) {
        return (
            <div>Error loading project total value...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Total value in slot is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Total value"
            value={data.toString()}

        />
    )
}