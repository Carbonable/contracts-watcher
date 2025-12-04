import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import LabelComponent from "~/components/common/LabelComponent";
import { DECIMALS } from "~/types/config";
import { bigIntToNumber, parseU256 } from "~/utils/starknet";
import LoadingAndError from "~/components/common/LoadingAndError";

export default function TotalDeposited() {
    const { yielderAbi, yielderAddress } = useProjectAbis();

    const title = "Total deposited";
    const isReady = Boolean(yielderAbi && yielderAddress);

    const { data, error, isError, isLoading } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_total_deposited',
        args: [],
        watch: false,
        enabled: isReady
    });

    if (!isReady || isLoading) {
        return <LoadingAndError title={title} isLoading={true} isError={false} error={undefined} />;
    }

    const value = parseU256(data);

    if (isError || value === undefined) {
        return (
            <LoadingAndError
                title={title}
                isLoading={false}
                isError={true}
                error={error}
            />
        )
    }

    return (
        <LabelComponent
            title={title}
            value={`$${(bigIntToNumber(value) * Math.pow(10, -DECIMALS)).toString()}`}
        />
    )
}
