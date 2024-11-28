import { StarknetConfig, argent, braavos, nethermindProvider, publicProvider } from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { useMemo } from "react";

export function StarknetProvider({ children, defautlNetwork, rpcApiKey }: { children: React.ReactNode, defautlNetwork: string, rpcApiKey: string }) {

  const chains = useMemo(() => {
      if (defautlNetwork === 'mainnet') {
        return [mainnet];
      }

      return [sepolia]
    }, [defautlNetwork]);
  
    // const provider = nethermindProvider({ apiKey: rpcApiKey });
    const provider = publicProvider();
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
