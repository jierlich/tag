// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ITag.sol";

contract It is ERC721 {
    uint counter = 0;
    uint mintAmount = 420;
    uint constant burnAmount = 420;
    bool locked = true;
    address erc20;
    address owner;

    constructor(address _erc20) {
        erc20 = _erc20;
        owner = msg.sender;
    }

    function mint(address to) {
        require(counter < 10000, "Max mint reached");
        ITag(erc20).burnFrom(msg.sender, burnAmount);
        counter++;
        super._safeMint(to, counter);
        if (counter == 1337) {
            mintAmount = 69;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        /// @dev this condition is true when minting
        if (from == address(0)) {
            return;
        }

        /// @dev only let the holder send the token while lockd
        require(!locked || from == msg.sender, 'Only holder can transfer while locked');
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._transfer(from, to, tokenId);
        /// @dev reward transfer with tokens
        ITag(erc20).mint(from, mintAmount);
    }


    function setOwner (address _owner) {
        require(owner == msg.sender, 'Only owner can call this function');
        owner = _owner;
    }

    function unlock () {
        require(owner == msg.sender, 'Only owner can call this function');
        locked = false;
    }
}
