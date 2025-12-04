import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { parseU256 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function TokenSupply() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const title = "Token supply";

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'token_supply_in_slot',
        args: [slot]
    });

    const value = parseU256(data);

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
        <LabelComponent
            title={title}
            value={value.toString()}
        />
    )
}
