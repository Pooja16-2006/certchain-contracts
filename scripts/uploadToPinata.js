import PinataSDK from "@pinata/sdk";
import * as dotenv from "dotenv";

dotenv.config();
const jwt = process.env.PINATA_JWT?.trim();
console.log("JWT loaded:", jwt ? "YES" : "NO - check your .env file");

const pinata = new PinataSDK({ 
  pinataJWTKey: jwt
});

async function uploadCertificateMetadata(recipientName, courseName, recipientWallet) {
  const metadata = {
    name: `Certificate - ${courseName}`,
    description: `This NFT certifies that ${recipientName} has successfully completed ${courseName}.`,
    image: "ipfs://bafybeibozpulxtpv5nhfa2ue3dcjx23ndh3bwbr2ce5cf5qb3mqd3owdoe",
    attributes: [
      { trait_type: "Recipient Name", value: recipientName },
      { trait_type: "Course",         value: courseName },
      { trait_type: "Wallet",         value: recipientWallet },
      { trait_type: "Issue Date",     value: new Date().toISOString() }
    ]
  };

  console.log("Uploading metadata to IPFS...");

  const result = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: `cert-${recipientName}-${courseName}` }
  });

  const ipfsUri = `ipfs://${result.IpfsHash}`;
  console.log("Uploaded! IPFS URI:", ipfsUri);
  return ipfsUri;
}

uploadCertificateMetadata("Pooh", "Blockchain Development", "0xYourWalletAddress")
  .catch(console.error);