import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { parseFelt252 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function ValueDecimals() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const title = "Value decimals";

    const { data, error, isLoading, isError } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'value_decimals',
        args: []
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
        <LabelComponent
            title={title}
            value={value.toString()}
        />
    )
}
