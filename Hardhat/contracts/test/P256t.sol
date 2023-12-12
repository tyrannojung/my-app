// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

/**
 * Helper library for external contracts to verify P256 signatures.
 **/
import "./P256Verifiert.sol";

contract P256t {

    P256Verifiert public p256Verifier = new P256Verifiert();

    function verifySignatureAllowMalleability(
        bytes32 message_hash,
        uint256 r,
        uint256 s,
        uint256 x,
        uint256 y
    ) public view returns (bool) {
        bytes memory args = abi.encode(message_hash, r, s, x, y);
        uint256 result = p256Verifier.testCode(args);

        return result == 1;
    }

    /// P256 curve order n/2 for malleability check
    uint256 constant P256_N_DIV_2 =
        57896044605178124381348723474703786764998477612067880171211129530534256022184;

    function verifySignature(
        bytes32 message_hash,
        uint256 r,
        uint256 s,
        uint256 x,
        uint256 y
    ) public view returns (bool) {
        // check for signature malleability
        if (s > P256_N_DIV_2) {
            return false;
        }

        return verifySignatureAllowMalleability(message_hash, r, s, x, y);
    }
}
