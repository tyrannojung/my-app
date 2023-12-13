// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;


import "./P256t.sol";


contract WebauthnVerifiert {
    
    P256t public p256t = new P256t();

    uint256[2] public public_key_coordinates = [
        0x37904b2e629111f83172c0180bbe617b931013d02595e84fbcc73bb82357d3d8,
        0xc7f041f64e8d51ad42509e039bbe7520a59f15d3d7acce3b47ca114f4ce0b02c
    ];

    function validateSigTest(bytes memory validatecheck)
        public view returns (uint256 validationData) {

        (
            bytes32 messageHash,
            uint256[2] memory sigCoordinates
        )
        = _parseLoginServiceData(validatecheck);

        bool res = p256t.verifySignature(messageHash, sigCoordinates[0], sigCoordinates[1], public_key_coordinates[0], public_key_coordinates[1]);
        if (res == true) {
            return 0;
        }
        
        return 1; //fail

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
}

