import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, shortString } from "starknet";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { parseFelt252 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function Name() {
    const { projectAbi, projectAddress } = useProjectAbis();

    const title = "Name";

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'name',
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
            title="Name"
            value={shortString.decodeShortString(num.toHex(value)).toString()}
        />
    )
}
