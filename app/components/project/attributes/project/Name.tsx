import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function Name() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'name'
    });

    const title = "Name";

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
            title="Name"
            value={shortString.decodeShortString(num.toHex(data)).toString()}

        />
    )
}