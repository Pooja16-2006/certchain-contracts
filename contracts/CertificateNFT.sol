// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin's ERC-721 with URI storage — lets each token have its own URI
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Ownable — only the contract owner (issuer) can mint/revoke
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {

    // Auto-incrementing token ID counter
    uint256 private _nextTokenId;

    // Struct: all the data we want to store on-chain per certificate
    struct Certificate {
        string recipientName;
        string courseName;
        uint256 issueDate;   // Unix timestamp
        bool revoked;        // can be invalidated after issuance
    }

    // tokenId → Certificate data
    mapping(uint256 => Certificate) public certificates;

    // --- Events ---
    // Emitted when a certificate NFT is minted
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string recipientName,
        string courseName
    );

    // Emitted when a certificate is revoked
    event CertificateRevoked(uint256 indexed tokenId);

    // Constructor: set the NFT collection name + symbol, and set deployer as owner
    constructor() ERC721("CertificateNFT", "CERT") Ownable(msg.sender) {}

    /**
     * @dev Issue a certificate — mints an NFT to the recipient.
     * Only the contract owner (your institution) can call this.
     *
     * @param recipient    Wallet address of the student
     * @param recipientName Student's name (stored on-chain)
     * @param courseName   Name of the course
     * @param tokenURI_    IPFS URI pointing to the certificate metadata JSON
     */
    function issueCertificate(
        address recipient,
        string memory recipientName,
        string memory courseName,
        string memory tokenURI_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        // Mint the NFT to the recipient's wallet
        _safeMint(recipient, tokenId);

        // Store the IPFS metadata URI on the token
        _setTokenURI(tokenId, tokenURI_);

        // Store certificate details on-chain
        certificates[tokenId] = Certificate({
            recipientName: recipientName,
            courseName: courseName,
            issueDate: block.timestamp,
            revoked: false
        });

        // Fire the event so frontends/explorers can track it
        emit CertificateIssued(tokenId, recipient, recipientName, courseName);

        return tokenId;
    }

    /**
     * @dev Verify a certificate — returns its details and validity.
     * Anyone can call this (it's a view function, no gas cost).
     *
     * @param tokenId The NFT token ID to verify
     */
    function verifyCertificate(uint256 tokenId)
        external
        view
        returns (
            string memory recipientName,
            string memory courseName,
            uint256 issueDate,
            bool isValid,
            string memory metadataURI
        )
    {
        // Make sure this token actually exists
        require(ownerOf(tokenId) != address(0), "Certificate does not exist");

        Certificate memory cert = certificates[tokenId];

        return (
            cert.recipientName,
            cert.courseName,
            cert.issueDate,
            !cert.revoked,        // isValid = true if NOT revoked
            tokenURI(tokenId)     // IPFS URI from ERC721URIStorage
        );
    }

    /**
     * @dev Revoke a certificate — marks it invalid. NFT still exists but
     * verifyCertificate will return isValid = false.
     * Only owner can revoke.
     *
     * @param tokenId The token ID to revoke
     */
    function revokeCertificate(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Certificate does not exist");
        require(!certificates[tokenId].revoked, "Already revoked");

        certificates[tokenId].revoked = true;

        emit CertificateRevoked(tokenId);
    }
}