import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, type Abi, shortString } from "starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function PaymentTokenSymbol({ abi, address }: { abi: Abi, address: string}) {

    const { data, error, isError, isLoading } = useContractRead({
        address,
        abi,
        functionName: 'symbol'
    });

    const title = "Payment token";

    if (isLoading || isError || data === undefined || typeof data !== 'object') {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (data === undefined || typeof data !== 'object')}
                error={error}
            />
        )
    }

    return (
        <LabelComponent
            title="Payment token"
            value={shortString.decodeShortString(num.toHex((data as any).symbol)).toString()}

        />
    )
}