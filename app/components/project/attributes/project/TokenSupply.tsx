import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";

export default function TokenSupply() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const { data, error } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'token_supply_in_slot',
        args: [slot]
    });

    if (error) {
        return (
            <div>Error loading project token supply...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Token supply  is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Token supply"
            value={data.toString()}

        />
    )
}