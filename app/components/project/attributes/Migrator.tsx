import { useProjectAbis } from "../ProjectAbisWrapper";
import MigratorSlot from "./migrator/Slot";
import SourceAddress from "./migrator/SourceAddress";
import TargetAddress from "./migrator/TargetAddress";
import MigratorValue from "./migrator/Value";

export default function Migrator() {

    const { migratorAbi } = useProjectAbis();

    if (migratorAbi === undefined) {
        return (
            <div>No migrator contract for this project</div>
        )
    }

    return (
        <>
            <SourceAddress />
            <TargetAddress />
            <MigratorValue />
            <MigratorSlot />
        </>
    )
}