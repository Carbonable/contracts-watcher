import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function APR({ minterAddress }: { minterAddress: string}) {
    const { yielderAbi, yielderAddress } = useProjectAbis();
    const { data, error, isError, isLoading } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_apr',
        args: [minterAddress],
        parseResult: false
    });

    const title = "APR";

    if (isLoading || isError || data === undefined || typeof data !== 'object') {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (data === undefined || typeof data !== 'object')}
                error={error}
            />
        )
    }

    const dataAsArray = data as Array<string>
    const num = Number(dataAsArray[0]);
    const den = Number(dataAsArray[2]);
    const apr = (num / den) * 100;

    return (
        <LabelComponent
            title={title}
            value={`${apr}%`}
        />
    )
}