// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract ClaimVault is SepoliaConfig {
    using FHE for *;
    
    struct PrivacyClaim {
        euint32 claimId;
        euint32 amount;
        euint32 timestamp;
        euint8 status; // 0: pending, 1: approved, 2: rejected
        bool isActive;
        string claimType;
        string description;
        address claimant;
        address verifier;
        uint256 createdTime;
        uint256 lastUpdated;
    }
    
    struct VerificationRecord {
        euint32 verificationId;
        euint8 verificationStatus;
        euint32 confidenceScore;
        bool isVerified;
        string verificationHash;
        address verifier;
        uint256 timestamp;
    }
    
    struct VaultMetrics {
        euint32 totalClaims;
        euint32 approvedClaims;
        euint32 rejectedClaims;
        euint32 totalAmount;
        euint32 averageProcessingTime;
    }
    
    mapping(uint256 => PrivacyClaim) public claims;
    mapping(uint256 => VerificationRecord) public verifications;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public verifierReputation;
    mapping(string => euint32) public claimTypeCounts;
    
    uint256 public claimCounter;
    uint256 public verificationCounter;
    
    address public owner;
    address public admin;
    VaultMetrics public vaultMetrics;
    
    event ClaimSubmitted(uint256 indexed claimId, address indexed claimant, string claimType);
    event ClaimVerified(uint256 indexed claimId, uint8 status, address indexed verifier);
    event ClaimUpdated(uint256 indexed claimId, uint8 newStatus);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event VaultMetricsUpdated();
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin || msg.sender == owner, "Only admin can call this function");
        _;
    }
    
    constructor(address _admin) {
        owner = msg.sender;
        admin = _admin;
        
        // Initialize vault metrics
        vaultMetrics = VaultMetrics({
            totalClaims: FHE.asEuint32(0),
            approvedClaims: FHE.asEuint32(0),
            rejectedClaims: FHE.asEuint32(0),
            totalAmount: FHE.asEuint32(0),
            averageProcessingTime: FHE.asEuint32(0)
        });
    }
    
    function submitClaim(
        string memory _claimType,
        string memory _description,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_claimType).length > 0, "Claim type cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        uint256 claimId = claimCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        claims[claimId] = PrivacyClaim({
            claimId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            timestamp: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            status: FHE.asEuint8(0), // Pending status
            isActive: true,
            claimType: _claimType,
            description: _description,
            claimant: msg.sender,
            verifier: address(0),
            createdTime: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        // Update vault metrics
        vaultMetrics.totalClaims = FHE.add(vaultMetrics.totalClaims, FHE.asEuint32(1));
        vaultMetrics.totalAmount = FHE.add(vaultMetrics.totalAmount, internalAmount);
        
        // Update claim type counts
        claimTypeCounts[_claimType] = FHE.add(claimTypeCounts[_claimType], FHE.asEuint32(1));
        
        emit ClaimSubmitted(claimId, msg.sender, _claimType);
        return claimId;
    }
    
    function verifyClaim(
        uint256 claimId,
        euint8 verificationStatus,
        euint32 confidenceScore,
        string memory verificationHash
    ) public onlyAdmin returns (uint256) {
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        require(claims[claimId].isActive, "Claim is not active");
        
        uint256 verificationId = verificationCounter++;
        
        verifications[verificationId] = VerificationRecord({
            verificationId: FHE.asEuint32(0), // Will be set properly later
            verificationStatus: verificationStatus,
            confidenceScore: confidenceScore,
            isVerified: true,
            verificationHash: verificationHash,
            verifier: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update claim status
        claims[claimId].status = verificationStatus;
        claims[claimId].verifier = msg.sender;
        claims[claimId].lastUpdated = block.timestamp;
        
        // Update vault metrics based on verification status
        if (FHE.decrypt(verificationStatus) == 1) {
            vaultMetrics.approvedClaims = FHE.add(vaultMetrics.approvedClaims, FHE.asEuint32(1));
        } else if (FHE.decrypt(verificationStatus) == 2) {
            vaultMetrics.rejectedClaims = FHE.add(vaultMetrics.rejectedClaims, FHE.asEuint32(1));
        }
        
        emit ClaimVerified(claimId, 0, msg.sender); // Status will be decrypted off-chain
        return verificationId;
    }
    
    function updateClaimStatus(
        uint256 claimId,
        euint8 newStatus
    ) public onlyAdmin {
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        require(claims[claimId].isActive, "Claim is not active");
        
        claims[claimId].status = newStatus;
        claims[claimId].lastUpdated = block.timestamp;
        
        emit ClaimUpdated(claimId, 0); // Status will be decrypted off-chain
    }
    
    function updateUserReputation(
        address user,
        euint32 reputation
    ) public onlyAdmin {
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // Reputation will be decrypted off-chain
    }
    
    function updateVerifierReputation(
        address verifier,
        euint32 reputation
    ) public onlyAdmin {
        require(verifier != address(0), "Invalid verifier address");
        
        verifierReputation[verifier] = reputation;
        emit ReputationUpdated(verifier, 0); // Reputation will be decrypted off-chain
    }
    
    function deactivateClaim(uint256 claimId) public {
        require(
            claims[claimId].claimant == msg.sender || msg.sender == admin || msg.sender == owner,
            "Not authorized to deactivate this claim"
        );
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        
        claims[claimId].isActive = false;
        claims[claimId].lastUpdated = block.timestamp;
    }
    
    function getClaimInfo(uint256 claimId) public view returns (
        string memory claimType,
        string memory description,
        uint8 amount,
        uint8 status,
        bool isActive,
        address claimant,
        address verifier,
        uint256 createdTime,
        uint256 lastUpdated
    ) {
        PrivacyClaim storage claim = claims[claimId];
        return (
            claim.claimType,
            claim.description,
            0, // FHE.decrypt(claim.amount) - will be decrypted off-chain
            0, // FHE.decrypt(claim.status) - will be decrypted off-chain
            claim.isActive,
            claim.claimant,
            claim.verifier,
            claim.createdTime,
            claim.lastUpdated
        );
    }
    
    function getVerificationInfo(uint256 verificationId) public view returns (
        uint8 verificationStatus,
        uint8 confidenceScore,
        bool isVerified,
        string memory verificationHash,
        address verifier,
        uint256 timestamp
    ) {
        VerificationRecord storage verification = verifications[verificationId];
        return (
            0, // FHE.decrypt(verification.verificationStatus) - will be decrypted off-chain
            0, // FHE.decrypt(verification.confidenceScore) - will be decrypted off-chain
            verification.isVerified,
            verification.verificationHash,
            verification.verifier,
            verification.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getVerifierReputation(address verifier) public view returns (uint8) {
        return 0; // FHE.decrypt(verifierReputation[verifier]) - will be decrypted off-chain
    }
    
    function getVaultMetrics() public view returns (
        uint8 totalClaims,
        uint8 approvedClaims,
        uint8 rejectedClaims,
        uint8 totalAmount,
        uint8 averageProcessingTime
    ) {
        return (
            0, // FHE.decrypt(vaultMetrics.totalClaims) - will be decrypted off-chain
            0, // FHE.decrypt(vaultMetrics.approvedClaims) - will be decrypted off-chain
            0, // FHE.decrypt(vaultMetrics.rejectedClaims) - will be decrypted off-chain
            0, // FHE.decrypt(vaultMetrics.totalAmount) - will be decrypted off-chain
            0  // FHE.decrypt(vaultMetrics.averageProcessingTime) - will be decrypted off-chain
        );
    }
    
    function getClaimTypeCount(string memory claimType) public view returns (uint8) {
        return 0; // FHE.decrypt(claimTypeCounts[claimType]) - will be decrypted off-chain
    }
    
    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid owner address");
        owner = newOwner;
    }
}
