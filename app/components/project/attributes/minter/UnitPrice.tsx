import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { bigIntToNumber } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function UnitPrice() {
    const { minterAbi, minterAddress } = useProjectAbis();
    const { data, error, isLoading, isError } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'get_unit_price'
    });

    const title = "Unit price";

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
            value={bigIntToNumber(data).toString()}
        />
    )
}