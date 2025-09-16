// Deployment script for ClaimVault Privacy Protocol
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ClaimVault Privacy Protocol...");

  // Get the contract factory
  const ClaimVault = await ethers.getContractFactory("ClaimVault");

  // Deploy the contract
  // Get admin address from environment variable or use deployer as admin
  const adminAddress = process.env.ADMIN_ADDRESS || (await ethers.getSigners())[0].address;
  
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
