// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "./WebauthnAccount.sol";

/// @title WebauthnAccountFactory
/// @author dawoon jung
/// @notice A factory contract for creating WebauthnAccount instances
contract WebauthnAccountFactory {
    WebauthnAccount public immutable accountImplementation;

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new WebauthnAccount(_entryPoint);
    }

    /// @dev Creates a WebauthnAccount if it doesn't exist and returns its instance.
    /// @param owner The owner's bytes data
    /// @param salt The salt for address computation
    /// @param anPubkCoordinates The bytes representing account's public key coordinates
    /// @return ret The instance of WebauthnAccount created or retrieved
    function createAccount(bytes memory owner, uint256 salt, bytes memory anPubkCoordinates) public returns (WebauthnAccount ret) {
        address addr = getAddress(owner, salt, anPubkCoordinates);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return WebauthnAccount(payable(addr));
        }
        ret = WebauthnAccount(payable(new ERC1967Proxy{salt : bytes32(salt)}(
                address(accountImplementation),
                abi.encodeCall(WebauthnAccount.initialize, (owner, anPubkCoordinates))
            )));
    }


    /// @dev Calculates the counterfactual address of a potential account created by createAccount().
    /// @param owner The owner's bytes data
    /// @param salt The salt for address computation
    /// @param anPubkCoordinates The bytes representing account's public key coordinates
    /// @return address The computed address for the potential account
    function getAddress(bytes memory owner, uint256 salt ,bytes memory anPubkCoordinates) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
                type(ERC1967Proxy).creationCode,
                abi.encode(
                    address(accountImplementation),
                    abi.encodeCall(WebauthnAccount.initialize, (owner, anPubkCoordinates))
                )
            )));
    }
}



