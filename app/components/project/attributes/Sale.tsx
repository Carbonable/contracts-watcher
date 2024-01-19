import PreSaleOpen from "./minter/PreSaleOpen";
import PublicSaleOpen from "./minter/PublicSaleOpen";
import MinValuePerTx from "./minter/MinValuePerTx";
import MaxValuePerTx from "./minter/MaxValuePerTx";
import UnitPrice from "./minter/UnitPrice";
import ReservedValue from "./minter/ReservedValue";
import PaymentTokenAddress from "./payment/PaymentTokenAddress";
import { useProjectAbis } from "../ProjectAbisWrapper";
import AvailableValue from "./minter/AvailableValue";
import RemainingValue from "./minter/RemainingValue";
import { useConfig } from "~/root";

export default function Sale() {
    const { minterAbi, minterAddress } = useProjectAbis();
    const { isPublic } = useConfig();

    if (isPublic) {
        return (
            <>
                <div className="flex items-center justify-start gap-x-4">
                    <PreSaleOpen />
                    <PublicSaleOpen />
                </div>
                <UnitPrice />
                <RemainingValue />
                <ReservedValue />
                { minterAbi && minterAddress &&
                    <PaymentTokenAddress
                        abi={minterAbi}
                        address={minterAddress}
                    />
                }
            </>
        )
    }

    return (
        <>
            <div className="flex items-center justify-start gap-x-4">
                <PreSaleOpen />
                <PublicSaleOpen />
            </div>
            <MinValuePerTx />
            <MaxValuePerTx />
            <UnitPrice />
            <AvailableValue />
            <RemainingValue />
            <ReservedValue />
            { minterAbi && minterAddress &&
                <PaymentTokenAddress
                    abi={minterAbi}
                    address={minterAddress}
                />
            }
        </>
    )
}