import CertifierAccount from "./project/CertifierAccount";
import Name from "./project/Name";
import Symbol from "./project/Symbol";
import TokenSupply from "./project/TokenSupply";
import TotalValue from "./project/TotalValue";
import ValueDecimals from "./project/ValueDecimals";

export default function Project() {
    return (
        <>
            <Name />
            <Symbol />
            <ValueDecimals />
            <TokenSupply />
            <TotalValue />
            <CertifierAccount />
        </>
    )
}