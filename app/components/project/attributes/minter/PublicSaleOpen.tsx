import { useContractRead } from "@starknet-react/core";
import { useProjectAbis } from "../../ProjectAbisWrapper";
import BooleanComponent from "~/components/common/BooleanComponent";

export default function PublicSaleOpen() {
    const { minterAbi, minterAddress } = useProjectAbis();
    const { data, error, isLoading } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'is_public_sale_open'
    });

    const title = "Public sale";

    if (isLoading) {
        return (
            <BooleanComponent
                title={title}
                text="Loading..."
            />
        )
    }

    if (error || data === undefined || typeof data !== 'boolean') {
        return (
            <BooleanComponent
                title={title}
                text="Error"
            />
        )
    }

    return (
        <BooleanComponent
            title={title}
            text={data === true ? "Open" : "Closed"}
            value={data}
        />
    )
}