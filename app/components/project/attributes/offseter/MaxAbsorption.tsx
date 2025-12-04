import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { bigIntToNumber, parseU256 } from "~/utils/starknet";
import { DECIMALS } from "~/types/config";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MaxAbsorption() {
    const { offseterAbi, offseterAddress } = useProjectAbis();

    const title = "Max absorption";
    const isReady = Boolean(offseterAbi && offseterAddress);

    const { data, error, isError, isLoading } = useContractRead({
        address: offseterAddress,
        abi: offseterAbi,
        functionName: 'get_max_absorption',
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
            value={`t${(bigIntToNumber(value) * Math.pow(10, -DECIMALS)).toString()}`}
        />
    )
}
