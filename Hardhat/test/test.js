const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WebauthnAccountFactory", function () {

  const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  const owner = "0x29fb20129ab9a1f68edc9a01aad55a6b861032c6bb651d86a7d997cce666bb89"; // Fido public key no address type
  const salt = 0;
  const anPubkCoordinates = "0xb5726271c406ac5099978ff55b30172de195596b6df2c24d80898b9d793ca1229e0324d631dd01b2bc6b127822e6fa7ba42c425b56b5ab661e46f9c4ce252369";

  let WebauthnAccountFactory;
  let webauthnAccountFactory
  
  beforeEach(async function () {
    WebauthnAccountFactory = await ethers.getContractFactory("WebauthnAccountFactory");
    webauthnAccountFactory = await WebauthnAccountFactory.deploy(entryPoint);

  });

  
  it("Creating Wallets via Factory Contracts for create2 Addresses", async function () {
    const expectedAddress = await webauthnAccountFactory.getAddress(owner, salt, anPubkCoordinates);
    const account = await webauthnAccountFactory.createAccount(owner, salt, anPubkCoordinates);

    expect(expectedAddress).to.equal(account.to);
    
  });

});


describe("P256Verifier", function () {
  
  let P256Verifier;
  let p256Verifier;

  beforeEach(async () => {
    P256Verifier = await ethers.getContractFactory('P256t');
    p256Verifier = await P256Verifier.deploy();
  });

  
  it('Malleable signature', async function () {

    const messageHash = '0x267f9ea080b54bbea2443dff8aa543604564329783b6a515c6663a691c555490'
    const r = '0x01655c1753db6b61a9717e4ccc5d6c4bf7681623dd54c2d6babc55125756661c'
    const s = '0xf073023b6de130f18510af41f64f067c39adccd59f8789a55dbbe822b0ea2317'
    const x = '0x65a2fa44daad46eab0278703edb6c4dcf5e30b8a9aec09fdc71a56f52aa392e4'
    const y = '0x4a7a9e4604aa36898209997288e902ac544a555e4b5e0a9efef2b59233f3f437'

    const isVerified = await p256Verifier.verifySignature(
      messageHash,
      r,
      s,
      x,
      y
    );

    expect(isVerified).to.equal(false);

  });

  it('Non-malleable signature', async function () {

    const messageHash = '0x267f9ea080b54bbea2443dff8aa543604564329783b6a515c6663a691c555490'
    const r = '0x01655c1753db6b61a9717e4ccc5d6c4bf7681623dd54c2d6babc55125756661c'
    const s = '7033802732221576339889804108463427183539365869906989872244893535944704590394'
    const x = '0x65a2fa44daad46eab0278703edb6c4dcf5e30b8a9aec09fdc71a56f52aa392e4'
    const y = '0x4a7a9e4604aa36898209997288e902ac544a555e4b5e0a9efef2b59233f3f437'

    const isVerified = await p256Verifier.verifySignature(
      messageHash,
      r,
      s,
      x,
      y
    );

    expect(isVerified).to.equal(true);

  });

});