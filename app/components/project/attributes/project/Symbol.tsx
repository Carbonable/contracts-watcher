import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function Symbol() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'symbol'
    });

    const title = "Symbol";

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