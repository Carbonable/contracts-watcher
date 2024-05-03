import { useConfig } from "~/root";
import { useProjectAbis } from "../ProjectAbisWrapper";
import PaymentTokenAddress from "./payment/PaymentTokenAddress";
import APR from "./yielder/APR";
import CurrentPrice from "./yielder/CurrentPrice";
import MaxAbsorption from "./yielder/MaxAbsorption";
import MaxSale from "./yielder/MaxSale";
import TotalAbsorption from "./yielder/TotalAbsorption";
import TotalClaimable from "./yielder/TotalClaimable";
import TotalClaimed from "./yielder/TotalClaimed";
import TotalDeposited from "./yielder/TotalDeposited";
import TotalSale from "./yielder/TotalSale";

export default function Yield() {
    const { yielderAbi, yielderAddress, minterAddress } = useProjectAbis();
    const { isPublic } = useConfig();

    if (!yielderAbi || !yielderAddress) {
        return (
            <div className="w-full text-neutral-300">The yielder contract is not deployed yet</div>
        )
    }

    return (
        <>
            <TotalDeposited />
            <TotalAbsorption />
            <MaxAbsorption />
            <TotalSale />
            <MaxSale />
            <CurrentPrice />
            { yielderAbi && yielderAddress &&
                <PaymentTokenAddress
                    abi={yielderAbi}
                    address={yielderAddress}
                />
            }
            { !isPublic && minterAddress &&
                <APR minterAddress={minterAddress} />
            }
            <TotalClaimable />
            <TotalClaimed />
        </>
    )
}