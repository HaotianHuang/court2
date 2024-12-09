import { ethers } from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xb38572793FDF5e23A124BfD05D3a9E1C7c6772b7";
  
  console.log("Withdrawing funds from ChatPayment contract...");

  // Get the contract instance
  const chatPayment = await ethers.getContractAt("ChatPayment", CONTRACT_ADDRESS);

  // Call withdrawFunds
  const tx = await chatPayment.withdrawFunds();
  console.log("Withdrawal transaction submitted:", tx.hash);
  
  // Wait for the transaction to be mined
  await tx.wait();
  console.log("Withdrawal complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
