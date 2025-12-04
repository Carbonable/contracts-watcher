const { RpcProvider, Contract } = require('starknet');

const provider = new RpcProvider({ nodeUrl: 'https://rpc.carbonable.io' });

// Project contract
const projectAddress = '0x0516d0acb6341dcc567e85dc90c8f64e0c33d3daba0a310157d6bba0656c8769';
const minterAddress = '0x065ff26209e5b2089e84488568ca84d7981d95f2ccb77f2f39878c4ab98e96cc';

async function testProject() {
    console.log('=== TESTING PROJECT CONTRACT ===\n');

    // Get project class
    const classResult = await provider.getClassAt(projectAddress);
    let abi = classResult.abi;
    if (typeof abi === 'string') {
        abi = JSON.parse(abi);
    }

    console.log('ABI length:', abi.length);
    console.log('ABI types:', [...new Set(abi.map(item => item.type))]);

    // Look for interfaces
    const interfaces = abi.filter(item => item.type === 'interface');
    console.log('\nInterfaces found:', interfaces.length);

    interfaces.forEach((iface, i) => {
        console.log(`\n  Interface ${i + 1}: ${iface.name}`);
        if (iface.items) {
            const funcs = iface.items.filter(item => item.type === 'function').map(item => item.name);
            console.log(`    Functions: ${funcs.join(', ')}`);
        }
    });

    // Create contract
    const contract = new Contract(abi, projectAddress, provider);
    console.log('\n\nContract functions available:', Object.keys(contract.functions || {}).slice(0, 20));

    // Test symbol
    console.log('\n--- Testing symbol ---');
    if (contract.symbol) {
        try {
            const result = await contract.symbol();
            console.log('symbol result:', result);
        } catch (e) {
            console.log('symbol ERROR:', e.message);
        }
    } else {
        console.log('symbol not found');
    }

    // Test get_project_value
    console.log('\n--- Testing get_project_value ---');
    if (contract.get_project_value) {
        try {
            const result = await contract.get_project_value(1); // slot 1
            console.log('get_project_value result:', result);
        } catch (e) {
            console.log('get_project_value ERROR:', e.message);
        }
    } else {
        console.log('get_project_value not found');
    }

    console.log('\n\n=== TESTING MINTER CONTRACT ===\n');

    // Get minter class
    const minterClass = await provider.getClassAt(minterAddress);
    let minterAbi = minterClass.abi;
    if (typeof minterAbi === 'string') {
        minterAbi = JSON.parse(minterAbi);
    }

    const minterContract = new Contract(minterAbi, minterAddress, provider);
    console.log('Minter functions:', Object.keys(minterContract.functions || {}).slice(0, 20));

    // Test get_unit_price
    console.log('\n--- Testing get_unit_price ---');
    if (minterContract.get_unit_price) {
        try {
            const result = await minterContract.get_unit_price();
            console.log('get_unit_price result:', result);
        } catch (e) {
            console.log('get_unit_price ERROR:', e.message);
        }
    } else {
        console.log('get_unit_price not found');
    }

    // Test is_pre_sale_open
    console.log('\n--- Testing is_pre_sale_open ---');
    if (minterContract.is_pre_sale_open) {
        try {
            const result = await minterContract.is_pre_sale_open();
            console.log('is_pre_sale_open result:', result);
        } catch (e) {
            console.log('is_pre_sale_open ERROR:', e.message);
        }
    } else {
        console.log('is_pre_sale_open not found');
    }

    // Test is_public_sale_open
    console.log('\n--- Testing is_public_sale_open ---');
    if (minterContract.is_public_sale_open) {
        try {
            const result = await minterContract.is_public_sale_open();
            console.log('is_public_sale_open result:', result);
        } catch (e) {
            console.log('is_public_sale_open ERROR:', e.message);
        }
    } else {
        console.log('is_public_sale_open not found');
    }
}

testProject().catch(console.error);
