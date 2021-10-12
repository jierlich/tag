// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/// @title Tags let you mint Its
/// @author jierlich
contract Tag is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {}

    /// @dev this customization to allowance should allow the It contract to burn Tag tokens on It mint
    function allowance(address owner, address spender) public view override returns (uint256) {
        if(hasRole(MINTER_ROLE, _msgSender())){
            return 420000000000000000000;
        }
        return super.allowance(owner, spender);
    }
}