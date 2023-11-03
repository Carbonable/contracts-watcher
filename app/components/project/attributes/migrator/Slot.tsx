import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MigratorSlot() {
    const { migratorAbi, migratorAddress } = useProjectAbis();

    const { data, error, isLoading, isError } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'slot'
    });

    const title = "Slot";

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
            value={data.toString()}
        />
    )
}