// Deployment script for ClaimVault Privacy Protocol
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ClaimVault Privacy Protocol...");

  // Get the contract factory
  const ClaimVault = await ethers.getContractFactory("ClaimVault");

  // Deploy the contract
  // Replace with actual admin address
  const adminAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Example admin address
  
  const claimVault = await ClaimVault.deploy(adminAddress);

  await claimVault.waitForDeployment();

  const contractAddress = await claimVault.getAddress();
  
  console.log("ClaimVault deployed to:", contractAddress);
  console.log("Admin address:", adminAddress);
  console.log("Owner address:", await claimVault.owner());
  
  // Verify deployment
  console.log("Verifying deployment...");
  const owner = await claimVault.owner();
  const admin = await claimVault.admin();
  
  console.log("Contract owner:", owner);
  console.log("Contract admin:", admin);
  
  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
