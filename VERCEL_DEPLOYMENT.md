# Vercel Deployment Guide for ClaimVault Privacy Protocol

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. GitHub repository access
3. Environment variables ready

## Step-by-Step Deployment Process

### Step 1: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `SmartContractor11/claimvault-privacy-protocol`
4. Click "Import"

### Step 2: Configure Project Settings

1. **Project Name**: `claimvault-privacy-protocol`
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 3: Environment Variables Configuration

Add the following environment variables in Vercel dashboard:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_infura_rpc_url_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_ALTERNATIVE_RPC_URL=your_alternative_rpc_url
```

**How to add environment variables:**
1. In project settings, go to "Environment Variables"
2. Click "Add New"
3. Add each variable with its value
4. Make sure to select "Production", "Preview", and "Development" environments

### Step 4: Build Configuration

Create a `vercel.json` file in the root directory (already included):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your application will be available at the provided Vercel URL

### Step 6: Custom Domain (Optional)

1. Go to "Domains" in project settings
2. Add your custom domain
3. Configure DNS settings as instructed by Vercel
4. Enable SSL certificate

## Post-Deployment Configuration

### 1. Verify Environment Variables

Check that all environment variables are properly set:
- Chain ID: 11155111 (Sepolia)
- RPC URLs are accessible
- Wallet Connect Project ID is valid

### 2. Test Wallet Connection

1. Open the deployed application
2. Click "Connect Wallet"
3. Verify that RainbowKit modal appears
4. Test connection with different wallets

### 3. Test Smart Contract Integration

1. Ensure you're on Sepolia testnet
2. Have some Sepolia ETH for gas fees
3. Test claim submission functionality

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_`
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **Wallet Connection Issues**
   - Verify Wallet Connect Project ID
   - Check RPC URL accessibility
   - Ensure correct chain ID

4. **Smart Contract Errors**
   - Verify contract is deployed on Sepolia
   - Check contract address in configuration
   - Ensure sufficient gas fees

## Monitoring and Maintenance

### 1. Performance Monitoring

- Use Vercel Analytics to monitor performance
- Check build logs for any issues
- Monitor error rates and user interactions

### 2. Updates and Deployments

- Push changes to main branch for automatic deployment
- Use preview deployments for testing
- Monitor deployment status in Vercel dashboard

### 3. Security Considerations

- Regularly update dependencies
- Monitor for security vulnerabilities
- Keep environment variables secure
- Use HTTPS for all connections

## Production Checklist

- [ ] All environment variables configured
- [ ] Custom domain set up (if applicable)
- [ ] SSL certificate enabled
- [ ] Wallet connection tested
- [ ] Smart contract integration verified
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Backup and recovery plan in place

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh/)

## Contact

For deployment issues or questions:
- GitHub Issues: [ClaimVault Repository](https://github.com/SmartContractor11/claimvault-privacy-protocol)
- Email: judy.thompson44@brightcore.chat
