import { useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { type Abi } from "starknet";
import { fetchAbi } from "~/utils/starknet";
import PaymentTokenSymbol from "./PaymentTokenSymbol";

export default function PaymentTokenAbi({ address }: { address: string }) {
    const { provider } = useProvider();
    const [paymentTokenAbi, setPaymentTokenAbi] = useState<Abi|undefined>(undefined);

    useEffect(() => {
        async function fetchProjectAbiWrapper() {
            let abiResult = await fetchAbi(provider, address);
            setPaymentTokenAbi(abiResult);
        }

        fetchProjectAbiWrapper();
    }, [provider, address]);

    if (paymentTokenAbi === undefined) {
        return (
            <div>Loading payment token abi...</div>
        )
    }

    return (
        <PaymentTokenSymbol
            abi={paymentTokenAbi}
            address={address}
        />
    )
}
