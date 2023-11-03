import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";

export default function MigratorValue() {
    const { migratorAbi, migratorAddress } = useProjectAbis();

    const { data, error } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'value'
    });

    if (error) {
        return (
            <div>Error loading migrator value...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Migrator value is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Migrator value"
            value={data.toString()}

        />
    )
}