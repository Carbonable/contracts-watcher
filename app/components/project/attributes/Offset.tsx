import { useProjectAbis } from "../ProjectAbisWrapper";
import MaxAbsorption from "./offseter/MaxAbsorption";
import MinClaimable from "./offseter/MinClaimable";
import TotalAbsorption from "./offseter/TotalAbsorption";
import TotalClaimable from "./offseter/TotalClaimable";
import TotalClaimed from "./offseter/TotalClaimed";
import TotalDeposited from "./offseter/TotalDeposited";

export default function Offset() {
    const { offseterAbi, offseterAddress } = useProjectAbis();

    if (!offseterAbi || !offseterAddress) {
        return (
            <div className="w-full text-neutral-300">The offseter contract is not deployed yet</div>
        )
    }

    return (
        <>
            <TotalDeposited />
            <TotalAbsorption />
            <MaxAbsorption />
            <TotalClaimable />
            <TotalClaimed />
            <MinClaimable />
        </>
    )
}