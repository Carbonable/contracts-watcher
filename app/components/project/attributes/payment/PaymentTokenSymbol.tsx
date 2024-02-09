import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, type Abi, shortString } from "starknet";
import LoadingAndError from "~/components/common/LoadingAndError";
import { useEffect, useState } from "react";

export default function PaymentTokenSymbol({ abi, address }: { abi: Abi, address: string}) {

    const { data, error, isError, isLoading } = useContractRead({
        address,
        abi,
        functionName: 'symbol'
    });

    const [symbol, setSymbol] = useState<string>("");

    const title = "Payment token";

    useEffect(() => {
        if (data === undefined) { return; }

        if (typeof data === 'bigint') {
            setSymbol(shortString.decodeShortString(num.toHex(data)).toString());
            console.log(shortString.decodeShortString(num.toHex(data)).toString());
        }

        if (typeof data === 'object') {
            setSymbol(shortString.decodeShortString(num.toHex((data as any).symbol)).toString());
            console.log(shortString.decodeShortString(num.toHex((data as any).symbol)).toString());
        }
    }, [data]);

    if (isLoading || isError || data === undefined || (typeof data !== 'object' && typeof data !== 'bigint')) {
        return (
            <LoadingAndError
                title={title}
                isLoading={isLoading}
                isError={isError || (data === undefined || (typeof data !== 'object' && typeof data !== 'bigint'))}
                error={error}
            />
        )
    }

    return (
        <LabelComponent
            title="Payment token"
            value={symbol}
        />
    )
}