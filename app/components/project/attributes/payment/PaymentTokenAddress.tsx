import { useContractRead } from "@starknet-react/core";
import { type Abi, num } from "starknet";
import PaymentTokenAbi from "./PaymentTokenAbi";

export default function PaymentTokenAddress({ abi, address }: { abi: Abi, address: string}) {

    const { data, error } = useContractRead({
        address,
        abi,
        functionName: 'get_payment_token_address'
    });

    if (error) {
        return (
            <div>Error loading payment token address...</div>
        )
    }

    if (data === undefined || typeof data !== 'bigint') {
        return (
            <div>Payment token address is undefined...</div>
        )
    }

    return (
        <PaymentTokenAbi address={num.toHex(data)} />
    )
}