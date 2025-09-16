import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useState } from 'react';
import { parseEther } from 'viem';

// Contract ABI - This would be the actual ABI from your deployed contract
const CLAIM_VAULT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_claimType", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "submitClaim",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "claimId", "type": "uint256"}],
    "name": "getClaimInfo",
    "outputs": [
      {"internalType": "string", "name": "claimType", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "amount", "type": "uint8"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "address", "name": "claimant", "type": "address"},
      {"internalType": "address", "name": "verifier", "type": "address"},
      {"internalType": "uint256", "name": "createdTime", "type": "uint256"},
      {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVaultMetrics",
    "outputs": [
      {"internalType": "uint8", "name": "totalClaims", "type": "uint8"},
      {"internalType": "uint8", "name": "approvedClaims", "type": "uint8"},
      {"internalType": "uint8", "name": "rejectedClaims", "type": "uint8"},
      {"internalType": "uint8", "name": "totalAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "averageProcessingTime", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This would be your deployed contract address
const CLAIM_VAULT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual address

export function useClaimVault() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read vault metrics
  const { data: vaultMetrics, refetch: refetchMetrics } = useReadContract({
    address: CLAIM_VAULT_ADDRESS,
    abi: CLAIM_VAULT_ABI,
    functionName: 'getVaultMetrics',
  });

  const submitClaim = async (
    claimType: string,
    description: string,
    amount: string
  ) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);
    
    try {
      // For FHE, we would need to encrypt the amount and create a proof
      // This is a simplified version - in reality, you'd use FHE libraries
      const encryptedAmount = parseEther(amount);
      const inputProof = '0x'; // This would be the actual FHE proof
      
      const hash = await writeContract({
        address: CLAIM_VAULT_ADDRESS,
        abi: CLAIM_VAULT_ABI,
        functionName: 'submitClaim',
        args: [claimType, description, encryptedAmount, inputProof],
        value: parseEther('0.01'), // Small fee for processing
      });

      // Refetch metrics after successful submission
      await refetchMetrics();
      
      return hash;
    } catch (err) {
      console.error('Error submitting claim:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClaimInfo = async (claimId: number) => {
    // This would use useReadContract for a specific claim
    // Implementation depends on your contract structure
    return null;
  };

  return {
    submitClaim,
    getClaimInfo,
    vaultMetrics,
    isSubmitting,
    isPending,
    error,
    isConnected,
    address,
  };
}
