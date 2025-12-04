const { RpcProvider, Contract, num, hash } = require('starknet');

const RPC_URL = 'https://rpc.carbonable.io';
const YIELDER_ADDRESS = '0x03d25473be5a6316f351e8f964d0c303357c006f7107779f648d9879b7c6d58a';

async function main() {
    console.log('=== Testing Yielder Contract ===\n');

    const provider = new RpcProvider({ nodeUrl: RPC_URL });

    // First, get the class/ABI
    console.log('1. Fetching contract class...');
    let classResult;
    try {
        classResult = await provider.getClassAt(YIELDER_ADDRESS);
        console.log('   Got class at address');
    } catch (e) {
        console.log('   Error getting class at:', e.message);
        return;
    }

    // Parse ABI if it's a string (Sierra contracts)
    let abi = classResult.abi;
    if (typeof abi === 'string') {
        console.log('   ABI is a string, parsing...');
        abi = JSON.parse(abi);
    }
    console.log('   ABI entries:', abi.length);

    // Find available functions
    const functions = abi.filter(item => item.type === 'function' || item.type === 'interface');
    console.log('\n2. Available interfaces/functions:');

    // Look for the interface that has our functions
    const interfaces = abi.filter(item => item.type === 'interface');
    interfaces.forEach(iface => {
        console.log(`   Interface: ${iface.name}`);
        if (iface.items) {
            iface.items.forEach(item => {
                if (item.type === 'function') {
                    console.log(`     - ${item.name}`);
                }
            });
        }
    });

    // Create contract instance
    console.log('\n3. Creating contract instance...');
    const contract = new Contract(abi, YIELDER_ADDRESS, provider);

    // Test calling various functions
    const functionsToTest = [
        'get_total_deposited',
        'get_total_absorption',
        'get_max_absorption',
        'get_total_sale',
        'get_max_sale',
        'get_current_price',
        'get_total_claimable',
        'get_total_claimed'
    ];

    console.log('\n4. Calling yielder functions:');

    for (const funcName of functionsToTest) {
        try {
            console.log(`\n   Calling ${funcName}...`);
            const result = await contract[funcName]();
            console.log(`   Result:`, result);
            console.log(`   Type:`, typeof result);
            if (typeof result === 'object') {
                console.log(`   Keys:`, Object.keys(result));
                if (result.low !== undefined) {
                    console.log(`   low:`, result.low, `(${typeof result.low})`);
                    console.log(`   high:`, result.high, `(${typeof result.high})`);
                    // Calculate full u256 value
                    const fullValue = BigInt(result.low) + (BigInt(result.high) << 128n);
                    console.log(`   Full u256 value:`, fullValue.toString());
                }
            }
        } catch (e) {
            console.log(`   Error calling ${funcName}:`, e.message);
        }
    }

    // Also test raw RPC call
    console.log('\n5. Testing raw RPC call for get_total_deposited:');
    try {
        const selector = hash.getSelectorFromName('get_total_deposited');
        console.log('   Selector:', selector);

        const rawResult = await provider.callContract({
            contractAddress: YIELDER_ADDRESS,
            entrypoint: 'get_total_deposited',
            calldata: []
        });
        console.log('   Raw RPC result:', rawResult);
    } catch (e) {
        console.log('   Error:', e.message);
    }
}

main().catch(console.error);
