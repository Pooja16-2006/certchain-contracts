import hre from "hardhat";

async function main() {
  console.log("Deploying CertificateNFT to Sepolia...");

  // Hardhat 3: get ethers from network connection
  const { ethers } = await hre.network.connect({ network: "sepolia" });

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from wallet:", deployer.address);

  const Factory = await ethers.getContractFactory("CertificateNFT");
  const contract = await Factory.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ CertificateNFT deployed to:", address);
  console.log("View on Etherscan: https://sepolia.etherscan.io/address/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});