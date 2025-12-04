import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { DECIMALS } from "~/types/config";
import { bigIntToNumber, parseU256 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MaxValue() {
    const { minterAbi, minterAddress } = useProjectAbis();

    const title = "Max value";
    const isReady = Boolean(minterAbi && minterAddress);

    const { data, isError, isLoading, error } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'get_max_value',
        args: [],
        enabled: isReady
    });

    if (!isReady || isLoading) {
        return <LoadingAndError title={title} isLoading={true} isError={false} error={undefined} />;
    }

    const value = parseU256(data);

    if (isError || value === undefined) {
        return (
            <LoadingAndError
                title={title}
                isLoading={false}
                isError={true}
                error={error}
            />
        )
    }

    return (
        <LabelComponent
            title={title}
            value={(bigIntToNumber(value) * Math.pow(10, -DECIMALS)).toString()}
        />
    )
}
