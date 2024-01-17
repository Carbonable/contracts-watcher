import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { DECIMALS } from "~/types/config";
import { bigIntToNumber } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MinValuePerTx() {
    const { minterAbi, minterAddress } = useProjectAbis();
    const { data, error, isLoading, isError } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'get_min_value_per_tx'
    });

    const title = "Min value per tx";

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
            value={(bigIntToNumber(data) * Math.pow(10, -DECIMALS)).toString()}
        />
    )
}