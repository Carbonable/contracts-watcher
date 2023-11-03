import { useContractRead } from "@starknet-react/core";
import LabelComponent from "~/components/common/LabelComponent";
import { num, type Abi, shortString } from "starknet";

export default function PaymentTokenSymbol({ abi, address }: { abi: Abi, address: string}) {

    const { data, error } = useContractRead({
        address,
        abi,
        functionName: 'symbol'
    });

    if (error) {
        return (
            <div>Error loading payment token symbol...</div>
        )
    }

    if (data === undefined || typeof data !== 'object') {
        return (
            <div>Payment token symbol is undefined...</div>
        )
    }

    return (
        <LabelComponent
            title="Payment token"
            value={shortString.decodeShortString(num.toHex((data as any).symbol)).toString()}

        />
    )
}