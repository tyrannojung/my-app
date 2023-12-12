const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Create Contract Address', function () {
    
    const pubKey = [
        '0xfac613cef6a79712d635181c681fd6b827748236aaf4dc3804ffa53f21a8dfc5',
        '0x40c6954650241df5baa675a26226d6623ca09c4b23985e566cd47a64893dde4f'
    ];
    const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
    
    let WebauthnAccountFactoryContract;
    let WebauthnAccountContract;

    beforeEach(async () => {
        try {
            // 배포된 컨트랙트 인스턴스 생성
            const ContractFactory = await ethers.getContractFactory('WebauthnAccountFactory');
            WebauthnAccountFactoryContract = await ContractFactory.deploy(entryPoint);
            await WebauthnAccountFactoryContract.deployed();
            
        } catch (error) {
            console.error("Error during contract deployment:", error);
            throw error; // 예외를 다시 던져서 테스트를 중지하고 오류를 표시합니다.
        }
    });

    it('Creating Wallets via Factory Contracts for create2 Addresses', async function() {
        
        const owner = '0x1a92ecd441d4ce3c938e236048b8d610b51b776eb5c75afee12c50b8e367ed5a'
        const salt = 0

        const encodePubkCoordinates = ethers.utils.defaultAbiCoder.encode(
            ["uint256[2]"],
            [pubKey],
        );
        console.log(encodePubkCoordinates);

        try {
            WebauthnAccountContract = await WebauthnAccountFactoryContract.createAccount(
                owner,
                salt,
                encodePubkCoordinates
            );

            console.log(WebauthnAccountContract);
        } catch (error) {
            console.error("Error creating account:", error);
            throw error; // 예외를 다시 던져서 테스트를 중지하고 오류를 표시합니다.
        }
    });
});


    // })

    // Malleable signature
    // none Malleable signature

        // const sig = [
        //     '0x01655c1753db6b61a9717e4ccc5d6c4bf7681623dd54c2d6babc55125756661c',
        //     '7033802732221576339889804108463427183539365869906989872244893535944704590394'
        // ]
        //const messageHash = '0x267f9ea080b54bbea2443dff8aa543604564329783b6a515c6663a691c555490'

