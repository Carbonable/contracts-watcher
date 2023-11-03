import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function TokenSupply() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'token_supply_in_slot',
        args: [slot]
    });

    const title = "Token supply";

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
        <LabelComponent
            title={title}
            value={data.toString()}

        />
    )
}