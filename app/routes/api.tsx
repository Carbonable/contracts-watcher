import { type ActionFunctionArgs } from "@remix-run/node";

export async function action({request}: ActionFunctionArgs) {
    const body = await request.json();
    const rpc = process.env.RPC;
    const rpcApiKey = process.env.RPC_API_KEY || '';

    if (!rpc) {
        throw new Error('No RPC endpoint provided');
    }

    const res = await fetch(rpc, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': rpcApiKey
        },
        body: JSON.stringify(body)
    })

    return await res.json();
}