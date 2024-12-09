import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ChatPayment contract to Base Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const chatPayment = await ethers.deployContract("ChatPayment");
  await chatPayment.waitForDeployment();

  const address = await chatPayment.getAddress();
  console.log(`ChatPayment deployed to: ${address}`);
  console.log("Verify contract on Base Sepolia Explorer:");
  console.log(`https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
