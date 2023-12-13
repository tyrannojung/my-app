const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WebauthnAccountFactory", function () {

  const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  const owner = "0x29fb20129ab9a1f68edc9a01aad55a6b861032c6bb651d86a7d997cce666bb89"; // Fido public key no address type
  const salt = 0;
  const anPubkCoordinates = "0xb5726271c406ac5099978ff55b30172de195596b6df2c24d80898b9d793ca1229e0324d631dd01b2bc6b127822e6fa7ba42c425b56b5ab661e46f9c4ce252369";

  let WebauthnAccountFactory;
  let webauthnAccountFactory
  
  // test1 create2 factory test
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

  // test2 Malleable signature test
  it('Malleable signature', async function () {

    const pub1 = '0x7155f488d2b2dcd725c970fce7ff31d5c9dfb01ab7e5cfbc941e8b123b3e5d80' // webauthn pubk1
    const pub2 = '0xcbefc201160c765a641b7e12652b0bf97fa93f8c7abf66fb02b5a8fefc244542' //webauthn pubk1
    const sig1 = '0xd26acbcc358c7445ec91a63a0b26ffa50d3d10a5542758f608abd187f2f90433' //sig1
    const sig2 = '0x0fe5eeede8eadfa7843f2d46ae780c2758ceaf714682dae17' //sig2 
    const messageHash = '0x389bfc09a2b6ffaf87462b99289a86f566d276db9612f91e801c4f5e4064bc4c' // messageHash

    const isVerified = await p256Verifier.verifySignature(
      messageHash,
      sig1,
      sig2,
      pub1,
      pub2
    );

    expect(isVerified).to.equal(false);

  });

  // test2-2 Non-malleable signature test
  it('Non-malleable signature', async function () {

    const pub1 = '0x37904b2e629111f83172c0180bbe617b931013d02595e84fbcc73bb82357d3d8' //webauthn pubk1
    const pub2 = '0xc7f041f64e8d51ad42509e039bbe7520a59f15d3d7acce3b47ca114f4ce0b02c' //webauthn pubk1
    const sig1 = '0x15aaf6d7119230eaa4c945f7965c6109a82ad67d5e7a0845bb3a237cfa2a776d' //sig1
    const sig2 = '0x6f4cc187d02122438d0b6425229b56bccbd113f3de584d8af816dc3bbceaf046' //sig2 
    const messageHash = '0x5b61965616ca537c15186773df2646d4af4d4690403747e22e7401b94a8b6548' // messageHash

    console.log(messageHash)
    const isVerified = await p256Verifier.verifySignature(
      messageHash,
      sig1,
      sig2,
      pub1,
      pub2
    );

    expect(isVerified).to.equal(true);

  });
})

  
// test3 useroperation signature check test
describe("Operation Verifier", function () {

  let WebauthnVerifier;
  let webauthnVerifier;

  beforeEach(async () => {
    WebauthnVerifier = await ethers.getContractFactory('WebauthnVerifiert');
    webauthnVerifier = await WebauthnVerifier.deploy();
  });

  // 테스트1-1
  it('Malleable signature', async function () {

    const validatecheck = '0x5b61965616ca537c15186773df2646d4af4d4690403747e22e7401b94a8b654815aaf6d7119230eaa4c945f7965c6109a82ad67d5e7a0845bb3a237cfa2a776d6f4cc187d02122438d0b6425229b56bccbd113f3de584d8af816dc3bbceaf046' // validate check
    // byte32 = message hash, uint256[2] = [sig1, sig2] -> ethers.utils.defaultAbicoder.encode

    const isVerified = await webauthnVerifier.validateSigTest(
      validatecheck,
    );
    // 0 = true, 1 = fail
    expect(isVerified).to.equal(0n);

  })
})
