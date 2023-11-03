import { useContractRead } from "@starknet-react/core";
import { type Abi, num } from "starknet";
import PaymentTokenAbi from "./PaymentTokenAbi";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function PaymentTokenAddress({ abi, address }: { abi: Abi, address: string}) {

    const { data, error, isError, isLoading } = useContractRead({
        address,
        abi,
        functionName: 'get_payment_token_address'
    });

    const title = "Payment token address";

    if (isLoading || isError || data === undefined || typeof data !== 'bigint') {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (data === undefined || typeof data !== 'bigint')}
                error={error}
            />
        )
    }

    return (
        <PaymentTokenAbi address={num.toHex(data)} />
    )
}