const { RpcProvider, Contract } = require('starknet');

const provider = new RpcProvider({ nodeUrl: 'https://rpc.carbonable.io' });

// First project yielder address
const yielderAddress = '0x03d25473be5a6316f351e8f964d0c303357c006f7107779f648d9879b7c6d58a';

async function testYielder() {
    console.log('1. Testing RPC connection...');

    try {
        const chainId = await provider.getChainId();
        console.log('   Chain ID:', chainId);
    } catch (e) {
        console.error('   ERROR getting chain ID:', e.message);
        return;
    }

    console.log('\n2. Fetching yielder class...');
    let classResult;
    try {
        classResult = await provider.getClassAt(yielderAddress);
        console.log('   Class fetched. ABI type:', typeof classResult.abi);
        console.log('   Is ABI string?', typeof classResult.abi === 'string');
    } catch (e) {
        console.error('   ERROR fetching class:', e.message);
        return;
    }

    console.log('\n3. Parsing ABI...');
    let abi = classResult.abi;
    if (typeof abi === 'string') {
        try {
            abi = JSON.parse(abi);
            console.log('   ABI parsed from string. Length:', abi.length);
        } catch (e) {
            console.error('   ERROR parsing ABI:', e.message);
            return;
        }
    }

    // Check if it's a proxy
    const isProxy = abi.some(func => func.name === '__default__');
    console.log('   Is proxy?', isProxy);

    if (isProxy) {
        console.log('\n4. Getting implementation...');
        const proxyContract = new Contract(abi, yielderAddress, provider);

        const possibleFns = ["implementation", "getImplementation", "get_implementation"];
        const matchingFn = possibleFns.find(name => proxyContract[name] && typeof proxyContract[name] === "function");

        if (!matchingFn) {
            console.error('   No implementation function found');
            console.log('   Available functions:', Object.keys(proxyContract.functions || {}));
            return;
        }

        console.log('   Using function:', matchingFn);

        try {
            const result = await proxyContract[matchingFn]();
            console.log('   Implementation result:', result);

            const implAddress = result.implementation || result.address || result.implementation_hash_;
            console.log('   Implementation address:', implAddress);

            if (implAddress) {
                const implClass = await provider.getClassByHash(implAddress.toString(16).padStart(64, '0'));
                let implAbi = implClass.abi;
                if (typeof implAbi === 'string') {
                    implAbi = JSON.parse(implAbi);
                }
                abi = implAbi;
                console.log('   Implementation ABI length:', abi.length);
            }
        } catch (e) {
            console.error('   ERROR getting implementation:', e.message);
            return;
        }
    }

    console.log('\n5. Testing contract read with useContractRead pattern...');

    // Find get_total_deposited function
    const totalDepositedFn = abi.find(item =>
        item.name === 'get_total_deposited' ||
        (item.type === 'interface' && item.items?.some(i => i.name === 'get_total_deposited'))
    );

    console.log('   Found get_total_deposited?', !!totalDepositedFn);

    // Create contract and call
    const contract = new Contract(abi, yielderAddress, provider);
    console.log('   Contract functions:', Object.keys(contract.functions || {}).slice(0, 10));

    if (contract.get_total_deposited) {
        try {
            const result = await contract.get_total_deposited();
            console.log('   get_total_deposited result:', result);
            console.log('   Result type:', typeof result);
        } catch (e) {
            console.error('   ERROR calling get_total_deposited:', e.message);
        }
    } else {
        console.log('   get_total_deposited not found in contract');
    }

    if (contract.get_total_absorption) {
        try {
            const result = await contract.get_total_absorption();
            console.log('   get_total_absorption result:', result);
        } catch (e) {
            console.error('   ERROR calling get_total_absorption:', e.message);
        }
    }
}

testYielder().catch(console.error);
