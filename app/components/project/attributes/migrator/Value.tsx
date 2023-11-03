import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { bigIntToNumber } from "~/utils/starknet";
import { DECIMALS } from "~/types/config";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function MigratorValue() {
    const { migratorAbi, migratorAddress } = useProjectAbis();

    const { data, error, isError, isLoading } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'value'
    });

    const title = "Migrator value";

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
            value={`$${(bigIntToNumber(data) * Math.pow(10, -DECIMALS)).toLocaleString('en-US')}`}
        />
    )
}