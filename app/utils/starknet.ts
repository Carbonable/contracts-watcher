import { Contract, num } from "starknet";

export async function fetchAbi(provider: any, address: string) {
    const result = await provider.getClassAt(address);
    const abiResult = result.abi;
    const isProxy = abiResult.some((func: any) => (func.name === '__default__'));

    if (!isProxy) {
        return abiResult;
    }
    
    // If the contract is a proxy, fetch the implementation address
    const proxyContract = new Contract(abiResult, address, provider);
    const possibleImplementationFunctionNames = ["implementation", "getImplementation", "get_implementation"];
    const matchingFunctionName = possibleImplementationFunctionNames.find(name => proxyContract[name] && typeof proxyContract[name] === "function");
    
    if (matchingFunctionName === undefined) {
        return undefined;
    }

    const { implementation, address: implementation_address, implementation_hash_ } = await proxyContract[matchingFunctionName]();
    const hasImplementation = [implementation, implementation_address, implementation_hash_].find(variable => variable !== undefined);

    if (hasImplementation === undefined) {
        return undefined;
    }

    const implementationAddress = num.toHex(hasImplementation);

    try {
        const compiledContract = await provider.getClassByHash(implementationAddress);
        return compiledContract.abi;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export function bigIntToNumber(value: bigint) {
    return parseFloat(value.toString());
}
