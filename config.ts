// Environment configuration for ClaimVault Privacy Protocol
export const config = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'), // Sepolia testnet
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
  alternativeRpcUrl: process.env.NEXT_PUBLIC_ALTERNATIVE_RPC_URL || '',
} as const;
