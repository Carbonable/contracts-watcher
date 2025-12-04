import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import { bigIntToNumber, parseU256 } from "~/utils/starknet";
import { DECIMALS } from "~/types/config";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function ProjectValue() {
    const { projectAbi, projectAddress, slot } = useProjectAbis();

    const title = "Project value";

    const { data, error, isError, isLoading } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_project_value',
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
            value={`$${(bigIntToNumber(value) * Math.pow(10, -DECIMALS)).toLocaleString('en-US')}`}
        />
    )
}
