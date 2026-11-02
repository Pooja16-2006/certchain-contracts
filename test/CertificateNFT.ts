import { expect } from "chai";
import hre from "hardhat";

// Hardhat 3: create a local network instance, get ethers from it
const { ethers } = await hre.network.create();

describe("CertificateNFT", function () {
  let contract: any;
  let owner: any;
  let student: any;

  const fakeURI = "ipfs://QmYujHYfioQjHhpf2rr4rzAgr3hgffD5XCkiZwtZrY6XMD";

  beforeEach(async function () {
    [owner, student] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CertificateNFT");
    contract = await Factory.deploy();
  });

  it("should mint an NFT to the student", async function () {
    await contract.issueCertificate(student.address, "Pooh", "Blockchain Development", fakeURI);
    expect(await contract.ownerOf(0)).to.equal(student.address);
  });

  it("should return correct certificate details", async function () {
    await contract.issueCertificate(student.address, "Pooh", "Blockchain Development", fakeURI);
    const [name, course, , isValid, uri] = await contract.verifyCertificate(0);
    expect(name).to.equal("Pooh");
    expect(course).to.equal("Blockchain Development");
    expect(isValid).to.equal(true);
    expect(uri).to.equal(fakeURI);
  });

  it("should mark certificate as invalid after revocation", async function () {
    await contract.issueCertificate(student.address, "Pooh", "Blockchain Development", fakeURI);
    await contract.revokeCertificate(0);
    const [, , , isValid] = await contract.verifyCertificate(0);
    expect(isValid).to.equal(false);
  });

  it("should reject issuance from non-owner", async function () {
    await expect(
      contract.connect(student).issueCertificate(student.address, "Hacker", "Fake Course", fakeURI)
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
  });

  it("should reject revocation from non-owner", async function () {
    await contract.issueCertificate(student.address, "Pooh", "Blockchain Development", fakeURI);
    await expect(
      contract.connect(student).revokeCertificate(0)
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
  });

  it("should reject revoking an already revoked certificate", async function () {
    await contract.issueCertificate(student.address, "Pooh", "Blockchain Development", fakeURI);
    await contract.revokeCertificate(0);
    await expect(contract.revokeCertificate(0)).to.be.revertedWith("Already revoked");
  });
});