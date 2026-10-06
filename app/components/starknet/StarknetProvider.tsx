import { StarknetConfig, argent, braavos, jsonRpcProvider } from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { useMemo } from "react";

export function StarknetProvider({ children, defautlNetwork, rpcUrl }: { children: React.ReactNode, defautlNetwork: string, rpcUrl: string }) {

  const chains = useMemo(() => {
      if (defautlNetwork === 'mainnet') {
        return [mainnet];
      }

      return [sepolia]
    }, [defautlNetwork]);

    const provider = jsonRpcProvider({
      rpc: () => ({ nodeUrl: rpcUrl, blockIdentifier: 'latest' })
    });
    const connectors = useMemo(() => [braavos(), argent()], []);

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
