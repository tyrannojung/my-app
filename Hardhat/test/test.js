const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WebauthnAccountFactory", function () {
  let factory;

  beforeEach(async function () {
    const WebauthnAccountFactory = await ethers.getContractFactory("WebauthnAccountFactory");
    factory = await WebauthnAccountFactory.deploy('0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789');

  });

  it("Should create a new WebauthnAccount", async function () {

    const owner = "0x29fb20129ab9a1f68edc9a01aad55a6b861032c6bb651d86a7d997cce666bb89"; // Replace with the actual owner address
    const salt = 0; // Replace with the desired salt value
    const anPubkCoordinates = "0xb5726271c406ac5099978ff55b30172de195596b6df2c24d80898b9d793ca1229e0324d631dd01b2bc6b127822e6fa7ba42c425b56b5ab661e46f9c4ce252369"; // Replace with the actual anPubkCoordinates
    const accountAddress = await factory.createAccount(
      owner,
      salt,
      anPubkCoordinates
  );
  
    console.log(accountAddress)

  });
}); 