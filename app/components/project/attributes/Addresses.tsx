import { useProjectAbis } from "../ProjectAbisWrapper";
import { useConfig } from "~/root";
import { ContractLinkComponent } from "~/components/common/LinkComponent";

export default function Addresses() {
    const { projectAddress, minterAddress, yielderAddress, offseterAddress, migratorAddress } = useProjectAbis();
    const { voyagerContractURL } = useConfig();

    return (
        <>
            <ContractLinkComponent
                title="Project adddress"
                address={projectAddress}
                href={voyagerContractURL + projectAddress}
            />
            { minterAddress && <ContractLinkComponent
                title="Minter address"
                address={minterAddress}
                href={voyagerContractURL + minterAddress}
            />}
            { yielderAddress && <ContractLinkComponent
                title="Yielder address"
                address={yielderAddress}
                href={voyagerContractURL + yielderAddress}
            />}
            { offseterAddress && <ContractLinkComponent
                title="Offseter address"
                address={offseterAddress}
                href={voyagerContractURL + offseterAddress}
            />}
            { migratorAddress && <ContractLinkComponent
                title="Migrator address"
                address={migratorAddress}
                href={voyagerContractURL + migratorAddress}
            />}
        </>
    )
}