import { useProjectAbis } from "./ProjectAbisWrapper";
import MigationContracts from "./migration/MigrationContracts";

export default function MigrationStatusWrapper() {
    const { migratorAddress, migratorAbi, oldNFTAddress } = useProjectAbis();

    if (!migratorAddress || !migratorAbi || !oldNFTAddress) {
        return (
            <div className="w-full mt-4 text-xl text-neutral-300">
                No migration needed on this project.
            </div>
        );
    }

    return (
        <MigationContracts
            migratorAbi={migratorAbi}
            migratorAddress={migratorAddress}
        />
    );
}