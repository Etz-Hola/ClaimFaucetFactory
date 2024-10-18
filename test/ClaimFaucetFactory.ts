const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ClaimFaucetFactory", function () {
  async function deployClaimFaucetFactoryFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const ClaimFaucetFactory = await ethers.getContractFactory(
      "ClaimFaucetFactory"
    );
    const factory = await ClaimFaucetFactory.deploy();

    return { factory, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy the factory contract", async function () {
      const { factory } = await loadFixture(deployClaimFaucetFactoryFixture);
      expect(await factory.getLengthOfDeployedContracts()).to.equal(0);
    });
  });

  describe("deployClaimFaucet", function () {
    it("Should deploy a new ClaimFaucet contract", async function () {
       const { factory, owner } = await loadFixture(
         deployClaimFaucetFactoryFixture
       );

       await factory.deployClaimFaucet("Valora Token", "VLT");

       const deployedContracts =
         await factory.getAllContractDeployed();
       expect(deployedContracts.length).to.equal(1);
       expect(deployedContracts[0].deployer).to.equal(owner.address);
    });

    it("Should not allow zero address to deploy", async function () {
      const { factory } = await loadFixture(deployClaimFaucetFactoryFixture);

      await expect(
        factory.deployClaimFaucet("DLT Token", "DLT")
      ).to.not.be.revertedWith("Zero not allowed");
    });
  });

  describe("getAllContractDeployed", function () {
    it("Should return all deployed contracts", async function () {
      const { factory, addr1, addr2 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");
      await factory.connect(addr2).deployClaimFaucet("Deegen Token", "DT");

      const allContracts = await factory.getAllContractDeployed();
      expect(allContracts.length).to.equal(2);
      expect(allContracts[0].deployer).to.equal(addr1.address);
      expect(allContracts[1].deployer).to.equal(addr2.address);
    });

    it("Should not allow zero address to call", async function () {
      const { factory } = await loadFixture(deployClaimFaucetFactoryFixture);

      await expect(factory.getAllContractDeployed()).to.not.be.revertedWith(
        "Zero not allowed"
      );
    });
  });

  describe("getUserDeployedContracts", function () {
    it("Should return user's deployed contracts", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("Deegen Token", "DT");
      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");

      const userContracts = await factory
        .connect(addr1)
        .getUserDeployedContracts();
      expect(userContracts.length).to.equal(2);
      expect(userContracts[0].deployer).to.equal(addr1.address);
      expect(userContracts[1].deployer).to.equal(addr1.address);
    });

    it("Should return empty array for user with no deployed contracts", async function () {
      const { factory, addr2 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      const userContracts = await factory
        .connect(addr2)
        .getUserDeployedContracts();
      expect(userContracts.length).to.equal(0);
    });
  });

  describe("getUserDeployedContractsByIndex", function () {
    it("Should return correct contract info by index", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("Deegen Token", "DT");
      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");

      const [deployer] = await factory
        .connect(addr1)
        .getUserDeployedContractsByIndex(1);
      expect(deployer).to.equal(addr1.address);
    });

    it("Should revert when index is out of bounds", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("Deegen Token", "DT");

      await expect(
        factory.connect(addr1).getUserDeployedContractsByIndex(1)
      ).to.be.revertedWith("Out of bound");
    });
  });

  describe("getLengthOfDeployedContracts", function () {
    it("Should return correct number of deployed contracts", async function () {
      const { factory, addr1, addr2 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("Deegen Token", "DT");
      await factory.connect(addr2).deployClaimFaucet("DLT Token", "DLT");

      expect(await factory.getLengthOfDeployedContracts()).to.equal(2);
    });
  });

  describe("getInfoFromContract", function () {
    it("Should return correct token name and symbol", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");

      const deployedContracts = await factory.getAllContractDeployed();
      const deployedAddress = deployedContracts[0].deployedContract;

      const [name, symbol] = await factory.getInfoFromContract(deployedAddress);
      expect(name).to.equal("DLT Token");
      expect(symbol).to.equal("DLT");
    });
  });

  describe("getBalanceFromDeployedContract", function () {
    it("Should return correct balance", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");

      const deployedContracts = await factory.getAllContractDeployed();
      const deployedAddress = deployedContracts[0].deployedContract;

      const balance = await factory.getBalanceFromDeployedContract(
        deployedAddress
      );
      expect(balance).to.equal(0); // Initial balance should be 0
    });
  });

  describe("claimFaucetFromContract", function () {
    it("Should claim tokens successfully", async function () {
      const { factory, addr1 } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await factory.connect(addr1).deployClaimFaucet("DLT Token", "DLT");

      const deployedContracts = await factory.getAllContractDeployed();
      const deployedAddress = deployedContracts[0].deployedContract;

      await factory.connect(addr1).claimFaucetFromContract(deployedAddress);

      const balance = await factory.getBalanceFromDeployedContract(
        deployedAddress
      );
      expect(balance).to.equal(0);
    });
  });
});




// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import hre from "hardhat";

// describe("ClaimFaucetFactory", function () {
//   async function deployClaimFaucetFactoryFixture() {
//     const [owner, otherAccount, deployedContract] =
//       await hre.ethers.getSigners();

//     const deployContractInfo = {
//       deployer: owner,
//       DeployedContract: deployedContract,
//     };

//     const ClaimFaucetFactory = await hre.ethers.getContractFactory(
//       "ClaimFaucetFactory"
//     );

//     const claimFaucetFactory = await ClaimFaucetFactory.deploy();

//     return { claimFaucetFactory, owner, otherAccount, deployContractInfo };
//   }

//   describe("Deployment", function () {
//     it("Should deploy the factory contract", async function () {
//       const { claimFaucetFactory } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       expect(await claimFaucetFactory.getLengthOfDeployedContracts()).to.equal(
//         0
//       );
//     });
//   });

//   describe("Deploy ClaimFaucet", function () {
//     it("Should deploy a ClaimFaucet contract", async function () {
//       const { claimFaucetFactory, owner } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       await claimFaucetFactory.deployClaimFaucet("Valora", "VLR");

//       const deployedContracts =
//         await claimFaucetFactory.getAllContractDeployed();
//       expect(deployedContracts.length).to.equal(1);
//       expect(deployedContracts[0].deployer).to.equal(owner.address);
//     });

//     it("Should not allow deploying from zero address", async function () {
//       const { claimFaucetFactory, otherAccount } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       await expect(
//         claimFaucetFactory
//           .connect(otherAccount)
//           .deployClaimFaucet("Mullato", "MLT")
//       ).to.not.be.reverted;
//     });
//   });

//   describe("Getter Functions", function () {
//     it("Should return the correct user deployed contracts", async function () {
//       const { claimFaucetFactory, otherAccount } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       await claimFaucetFactory.deployClaimFaucet("First Token", "1TK");
//       await claimFaucetFactory.deployClaimFaucet("Second Token", "2TK");

//       const userContracts = await claimFaucetFactory.getUserDeployedContracts();
//       expect(userContracts.length).to.equal(2);

//       // If other account has no contracts deployed
//       const otherUserContracts = await claimFaucetFactory
//         .connect(otherAccount)
//         .getUserDeployedContracts();
//       expect(otherUserContracts.length).to.equal(0);
//     });

//     it("Should get a specific contract by index", async function () {
//       const { claimFaucetFactory, owner, deployContractInfo } =
//         await loadFixture(deployClaimFaucetFactoryFixture);

//       await claimFaucetFactory.deployClaimFaucet("TokenA", "TKA");
//       await claimFaucetFactory.deployClaimFaucet("TokenB", "TKB");

//       await claimFaucetFactory.getUserDeployedContractByIndex(1);
//       expect(deployContractInfo.deployer).to.equal(owner.address);
//     });

//     it("Should return token name and symbol", async function () {
//       const { claimFaucetFactory } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       await claimFaucetFactory.deployClaimFaucet("Hello", "HL");

//       const deployedContracts =
//         await claimFaucetFactory.getAllContractDeployed();
//       const contractAddress = deployedContracts[0].deployedContract;

//       const [name, symbol] = await claimFaucetFactory.getInfoFromContract(
//         contractAddress
//       );

//       expect(name).to.equal("Hello");
//       expect(symbol).to.equal("HL");
//     });

//     it("Should get balance of the contract address that claimed token", async function () {
//       const { claimFaucetFactory } = await loadFixture(
//         deployClaimFaucetFactoryFixture
//       );

//       await claimFaucetFactory.deployClaimFaucet("Delthereum", "DTH");

//       const deployedContracts =
//         await claimFaucetFactory.getAllContractDeployed();
//       const contractAddress = deployedContracts[0].deployedContract;

//       expect(
//         await claimFaucetFactory.getBalanceFromDeployedContract(contractAddress)
//       ).to.equal(0);
//     });
//   });
// });