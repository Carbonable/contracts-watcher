import { Contract, num } from "starknet";

export async function fetchAbi(provider: any, address: string) {
    let result;
    try {
        result = await provider.getClassAt(address);
    } catch (e) {
        try {
            result = await provider.getClassByHash(address);
        } catch (e2) {
            return undefined;
        }
    }

    // Handle Sierra contracts where ABI is a string
    let abiResult = result.abi;
    if (typeof abiResult === 'string') {
        try {
            abiResult = JSON.parse(abiResult);
        } catch (e) {
            return undefined;
        }
    }

    if (!Array.isArray(abiResult)) {
        return undefined;
    }

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
        // Handle Sierra contracts where ABI is a string
        let implAbi = compiledContract.abi;
        if (typeof implAbi === 'string') {
            try {
                implAbi = JSON.parse(implAbi);
            } catch (e) {
                return undefined;
            }
        }
        return implAbi;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export function bigIntToNumber(value: bigint) {
    return parseFloat(value.toString());
}

/**
 * Parse u256 value from contract read result.
 * u256 in Cairo can return as:
 * - bigint (already converted by starknet.js)
 * - {low, high} object (two felt252 values)
 * - [low, high] array
 */
export function parseU256(data: unknown): bigint | undefined {
    if (data === undefined || data === null) {
        return undefined;
    }

    if (typeof data === 'bigint') {
        return data;
    }

    if (typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if ('low' in obj && 'high' in obj) {
            return BigInt(obj.low as string | number | bigint) + (BigInt(obj.high as string | number | bigint) << 128n);
        }
        if (Array.isArray(data) && data.length >= 2) {
            return BigInt(data[0]) + (BigInt(data[1]) << 128n);
        }
    }

    // Try to convert directly if it's a number or string
    if (typeof data === 'number' || typeof data === 'string') {
        try {
            return BigInt(data);
        } catch {
            return undefined;
        }
    }

    return undefined;
}

/**
 * Parse felt252 value from contract read result.
 * felt252 can return as bigint, string, or number.
 */
export function parseFelt252(data: unknown): bigint | undefined {
    if (data === undefined || data === null) {
        return undefined;
    }

    if (typeof data === 'bigint') {
        return data;
    }

    if (typeof data === 'string' || typeof data === 'number') {
        try {
            return BigInt(data);
        } catch {
            return undefined;
        }
    }

    return undefined;
}
