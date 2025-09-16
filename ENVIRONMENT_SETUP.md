# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Frontend Configuration
```env
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_infura_rpc_url_here

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Alternative RPC
NEXT_PUBLIC_ALTERNATIVE_RPC_URL=your_alternative_rpc_url

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key

# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Hardhat Configuration (for deployment)
```env
# Hardhat Configuration
RPC_URL=your_infura_rpc_url_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
ADMIN_ADDRESS=your_admin_wallet_address
```

## How to Get These Values

### 1. Infura RPC URL
1. Go to [Infura](https://infura.io/)
2. Create an account and project
3. Copy the Sepolia endpoint URL
4. Format: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### 2. Wallet Connect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID

### 3. Private Key (for deployment)
1. Export your wallet's private key
2. **⚠️ Never commit this to version control**
3. Use a dedicated deployment wallet

### 4. Etherscan API Key
1. Go to [Etherscan](https://etherscan.io/apis)
2. Create an account
3. Generate an API key

## Security Notes

- ⚠️ **Never commit `.env.local` to version control**
- 🔒 Keep your private keys secure
- 🛡️ Use environment variables for all sensitive data
- 🔄 Rotate API keys regularly

## Vercel Deployment

For Vercel deployment, add these environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with its corresponding value
4. Make sure to select all environments (Production, Preview, Development)
