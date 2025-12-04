import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { DECIMALS } from "~/types/config";
import { bigIntToNumber, parseU256 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MinValuePerTx() {
    const { minterAbi, minterAddress } = useProjectAbis();

    const title = "Min value per tx";
    const isReady = Boolean(minterAbi && minterAddress);

    const { data, error, isLoading, isError } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'get_min_value_per_tx',
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
