import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";

export default function MigratorSlot() {
    const { migratorAbi, migratorAddress } = useProjectAbis();

    const { data, error } = useContractRead({
        address: migratorAddress,
        abi: migratorAbi,
        functionName: 'slot'
    });

    if (error) {
        return (
            <div>Error loading migrator slot...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Migrator slot is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Migrator slot"
            value={data.toString()}

        />
    )
}