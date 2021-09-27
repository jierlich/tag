// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract Tag is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {}

    function allowance(address owner, address spender) public view override {
        if(hasRole(MINTER_ROLE, _msgSender())){
            return 420;
        }
        return super.allowance(owner, spender);
    }
}