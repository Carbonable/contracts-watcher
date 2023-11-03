import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function ValueDecimals() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error, isLoading, isError } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'value_decimals'
    });

    const title = "Value decimals";

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
            value={shortString.decodeShortString(num.toHex(data)).toString()}

        />
    )
}