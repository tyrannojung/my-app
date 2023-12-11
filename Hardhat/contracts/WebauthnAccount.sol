// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "./lib/account-abstraction/core/BaseAccount.sol";
import "./lib/account-abstraction/callback/TokenCallbackHandler.sol";
import "./lib/p256-verifier/P256.sol";
/**
  * minimal account.
  *  this is sample minimal account.
  *  has execute, eth handling methods
  *  has a single signer that can send requests through the entryPoint.
  */
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


    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(msg.sender == address(this), "only owner");
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
     */
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

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
      * the implementation by calling `upgradeTo()`
     */
    function initialize(bytes memory anOwner, bytes memory anPubkCoordinates) public virtual {
        _initialize(anOwner, anPubkCoordinates);
    }

    function _initialize(bytes memory anOwner, bytes memory anPubkCoordinate) internal virtual {
        owner = anOwner;
        public_key_coordinates = abi.decode(anPubkCoordinate, (uint256[2]));
        emit WebauthnAccountInitialized(_entryPoint, owner);
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == address(this), "account: not Owner or EntryPoint");
    }

    /// implement template method of BaseAccount
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {

        (
            bytes32 messageHash,
            uint256[2] memory sigCoordinates
        )
        = _parseLoginServiceData(userOp.signature);

        bool res = P256.verifySignatureAllowMalleability(
            messageHash,
            sigCoordinates[0],
            sigCoordinates[1],
            public_key_coordinates[0],
            public_key_coordinates[1]
        );

        if(res == true) {
            res = P256.verifySignature(messageHash, sigCoordinates[0], sigCoordinates[1], public_key_coordinates[0], public_key_coordinates[1]);
            if (res == true) {
                return 0;
            }
        } else {
            bytes32 hash = userOpHash.toEthSignedMessageHash();
            if (address(this) != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        }
        
        return SIG_VALIDATION_FAILED;    

    }

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

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value : msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }


    function validateSigTest(bytes memory test)
        public view returns (uint256 validationData) {

        (
            bytes32 messageHash,
            uint256[2] memory sigCoordinates
        )
        = _parseLoginServiceData(test);

        bool res = P256.verifySignatureAllowMalleability(
            messageHash,
            sigCoordinates[0],
            sigCoordinates[1],
            public_key_coordinates[0],
            public_key_coordinates[1]
        );

        if(res == true) {
            res = P256.verifySignature(messageHash, sigCoordinates[0], sigCoordinates[1], public_key_coordinates[0], public_key_coordinates[1]);
            if (res == true) {
                return 0;
            }
        }
        
        return SIG_VALIDATION_FAILED;    

    }
}

