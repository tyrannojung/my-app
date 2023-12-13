// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "./lib/account-abstraction/core/BaseAccount.sol";
import "./lib/account-abstraction/callback/TokenCallbackHandler.sol";
import "./lib/p256-verifier/P256.sol";

/// @title WebauthnAccount
/// @author dawoon jung
/// @notice A factory contract for creating WebauthnAccount instances
contract WebauthnAccount is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable {
    using ECDSA for bytes32;

    bytes public owner;
    uint256[2] public public_key_coordinates;

    IEntryPoint private immutable _entryPoint;

    event WebauthnAccountInitialized(IEntryPoint indexed entryPoint, bytes indexed owner);

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        require(msg.sender == address(this), "only owner");
    }

    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        require(dest.length == func.length && (value.length == 0 || value.length == func.length), "wrong array lengths");
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
    }


    /// @dev Initializes the WebauthnAccount with owner data and public key coordinates.
    /// @param anOwner The owner's data in bytes
    /// @param anPubkCoordinates The bytes representing the account's public key coordinates
    function initialize(bytes memory anOwner, bytes memory anPubkCoordinates) public virtual {
        _initialize(anOwner, anPubkCoordinates);
    }


    /// @dev Internal function to set owner and public key coordinates during initialization.
    /// @param anOwner The owner's data in bytes
    /// @param anPubkCoordinate The bytes representing the account's public key coordinates
    function _initialize(bytes memory anOwner, bytes memory anPubkCoordinate) internal virtual {
        owner = anOwner;
        public_key_coordinates = abi.decode(anPubkCoordinate, (uint256[2]));
        emit WebauthnAccountInitialized(_entryPoint, owner);
    }

    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == address(this), "account: not Owner or EntryPoint");
    }


    /// @dev Validates the signature of a UserOperation against the provided hash.
    /// @param userOp The UserOperation calldata
    /// @param userOpHash The hash of the UserOperation
    /// @return validationData Returns SIG_VALIDATION_FAILED(1) if the signature validation fails, otherwise 0
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {

        (
            bytes32 messageHash,
            uint256[2] memory sigCoordinates
        )
        = _parseLoginServiceData(userOp.signature);

        bool res = P256.verifySignature(messageHash, sigCoordinates[0], sigCoordinates[1], public_key_coordinates[0], public_key_coordinates[1]);
        if (res == true) {
            return 0;
        } else {
            bytes32 hash = userOpHash.toEthSignedMessageHash();
            if (address(this) != hash.recover(userOp.signature))
                return SIG_VALIDATION_FAILED;
        }

        return SIG_VALIDATION_FAILED;    

    }

    /// @dev Parses login service data to extract message hash and signature coordinates.
    /// @param loginServiceData The data representing the signature
    /// @return messageHash The hash of the message
    /// @return sigCoordinates The signature coordinates
    function _parseLoginServiceData(bytes memory loginServiceData)
        internal
        pure
        returns (
            bytes32 messageHash,
            uint256[2] memory sigCoordinates
        )
    {
        return abi.decode(loginServiceData, (bytes32, uint256[2]));
    }


    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    function addDeposit() public payable {
        entryPoint().depositTo{value : msg.value}(address(this));
    }

    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }

}

