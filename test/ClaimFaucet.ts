// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("ClaimFaucet", function () {
//     let ClaimFaucet, claimFaucet, owner, addr1, addr2;

//     beforeEach(async function () {
//         // Deploying the contract
//         ClaimFaucet = await ethers.getContractFactory("ClaimFaucet");
//         [owner, addr1, addr2] = await ethers.getSigners();

//         // Initialize contract with token name and symbol
//         claimFaucet = await ClaimFaucet.deploy("DltToken", "DLT");
//         await claimFaucet.deployed();
//     });

//     it("Should initialize the contract correctly", async function () {
//         expect(await claimFaucet.name()).to.equal("DltToken");
//         expect(await claimFaucet.symbol()).to.equal("DLT");
//     });

//     it("Should allow a user to claim tokens for the first time", async function () {
//         const claimAmount = await claimFaucet.CLAIMABLE_AMOUNT();
        
//         // Claiming tokens for the first time
//         await expect(claimFaucet.claimToken(addr1.address))
//             .to.emit(claimFaucet, 'TokenClaimSuccessful')
//             .withArgs(addr1.address, claimAmount, anyValue); // anyValue for timestamp
        
//         // Check if tokens were minted to addr1
//         const balance = await claimFaucet.balanceOf(addr1.address);
//         expect(balance).to.equal(claimAmount);
//     });

//     it("Should prevent a user from claiming tokens again within 24 hours", async function () {
//         const claimAmount = await claimFaucet.CLAIMABLE_AMOUNT();

//         // First claim
//         await claimFaucet.claimToken(addr1.address);

//         // Try to claim again immediately (should fail)
//         await expect(claimFaucet.claimToken(addr1.address)).to.be.revertedWith(
//             "you can claim after 24 hours"
//         );
//     });

//     it("Should allow a user to claim tokens again after 24 hours", async function () {
//         const claimAmount = await claimFaucet.CLAIMABLE_AMOUNT();

//         // First claim
//         await claimFaucet.claimToken(addr1.address);

//         // Fast forward time by 24 hours
//         await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // 24 hours in seconds
//         await ethers.provider.send("evm_mine");

//         // Claim again (should succeed)
//         await expect(claimFaucet.claimToken(addr1.address))
//             .to.emit(claimFaucet, 'TokenClaimSuccessful')
//             .withArgs(addr1.address, claimAmount, anyValue);
//     });

//     it("Should revert if trying to claim with a zero address", async function () {
//         await expect(claimFaucet.claimToken(ethers.constants.AddressZero)).to.be.revertedWith(
//             "Zero address not allowed"
//         );
//     }); 
// });
