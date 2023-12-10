import { member } from "@/app/_types/member"
import { ethers } from 'ethers';
import { Address, Hash, concat, createClient, createPublicClient, encodeFunctionData, http, Hex } from "viem"
import { UserOperation, bundlerActions, getSenderAddress, getUserOperationHash, GetUserOperationReceiptReturnType } from "permissionless"
import { pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico"
import { generatePrivateKey, privateKeyToAccount, signMessage } from "viem/accounts"
import { lineaTestnet, polygonMumbai } from "viem/chains"


export async function bundlerCall(value : member): Promise<boolean> {
    
    const publicClient = createPublicClient({
        transport: http("https://rpc.goerli.linea.build/"),
        chain: lineaTestnet
      })
       
      const chain = "linea-testnet" // find the list of chain names on the Pimlico verifying paymaster reference page
      const apiKey = "a76e8d51-4ce4-4df3-88f7-ada0402502b2" // REPLACE THIS
       
      const bundlerClient = createClient({
        transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
        chain: lineaTestnet
      }).extend(bundlerActions).extend(pimlicoBundlerActions)
       
      const paymasterClient = createClient({
        // ⚠️ using v2 of the API ⚠️ 
        transport: http(`https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`),
        chain: lineaTestnet
      }).extend(pimlicoPaymasterActions)



    // console.log('input data', [
    //     value.pubk,
    //     BigInt(0),
    //     value.pubkCoordinates,
    // ])

    // const initcodeValue = ethers.utils.defaultAbiCoder.encode(
    //     ["bytes", "uint256", "uint256[2]"],
    //     [
    //         value.pubk,
    //       BigInt(0),
    //       value.pubkCoordinates
    //     ],
    //   ) as `0x${string}`


    // /** Factory Walelt을 만든다. */
    // // GENERATE THE INITCODE
    // const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"

    // const initCode = concat([
    // SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    // encodeFunctionData({
    //     abi: [{
    //     inputs: [
    //         { name: "value", type: "bytes" },
    //     ],
    //     name: "createAccount",
    //     outputs: [{ name: "ret", type: "address" }],
    //     stateMutability: "nonpayable",
    //     type: "function",
    //     }],
    //     args: [initcodeValue]
    // })
    // ]);

    // console.log("Generated initCode:", initCode)


    const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"
 
    const ownerPrivateKey = generatePrivateKey()
    const owner = privateKeyToAccount(ownerPrivateKey)
    
    console.log("Generated wallet with private key:", ownerPrivateKey)

    const initCode = concat([
        SIMPLE_ACCOUNT_FACTORY_ADDRESS,
        encodeFunctionData({
          abi: [{
            inputs: [{ name: "owner", type: "address" }, { name: "salt", type: "uint256" }],
            name: "createAccount",
            outputs: [{ name: "ret", type: "address" }],
            stateMutability: "nonpayable",
            type: "function",
          }],
          args: [owner.address, BigInt(0)]
        })
      ]);
       
    console.log("Generated initCode:", initCode)


    const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

    const senderAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint: ENTRY_POINT_ADDRESS
    })
    console.log("Calculated sender address:", senderAddress) 

    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik
    const data = "0x68656c6c6f" // "hello" encoded to utf-8 bytes
    
    const callData = encodeFunctionData({
    abi: [{
            inputs: [
        { name: "dest", type: "address" },
        { name: "value", type: "uint256" },
        { name: "func", type: "bytes" },
            ],
            name: "execute",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        }],
    args: [to, BigInt(0), data]
    })
    
    console.log("Generated callData:", callData)

    /*-----------------------------------------------------------------------------------------*/

const gasPrice = await bundlerClient.getUserOperationGasPrice()
 
const userOperation = {
    sender: senderAddress,
    nonce: BigInt(0),
    initCode,
    callData,
    maxFeePerGas: gasPrice.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
    signature: "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex
}

/*-----------------------------------------------------------------------------------------*/

// REQUEST PIMLICO VERIFYING PAYMASTER SPONSORSHIP
const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
    userOperation,
    entryPoint: ENTRY_POINT_ADDRESS
  })
   
  const sponsoredUserOperation: UserOperation = {
    ...userOperation,
    preVerificationGas: sponsorUserOperationResult.preVerificationGas,
    verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
    callGasLimit: sponsorUserOperationResult.callGasLimit,
    paymasterAndData: sponsorUserOperationResult.paymasterAndData
  }

  const signature = getUserOperationHash(
    {
      userOperation: sponsoredUserOperation, 
      chainId: lineaTestnet.id, 
      entryPoint: ENTRY_POINT_ADDRESS 
    });
   
  console.log("Received paymaster sponsor result:", sponsorUserOperationResult)
  console.log("signature", signature)
  

    return true
  }