// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ITag.sol";

contract It is ERC721 {
    uint public counter = 0;
    uint public transfers = 0;
    /// @dev Tag tokens minted when an It is transferred
    uint public nmintAmount = 420000000000000000000;
    /// @dev Tag tokens that must be burned to mint an It
    uint constant burnAmount = 420000000000000000000;
    /// @dev when true users can not approve others for transferring a token
    bool public locked = true;
    address public erc20;
    address public owner;

    constructor(string memory _name, string memory _symbol, address _erc20) ERC721(_name, _symbol) {
        erc20 = _erc20;
        owner = msg.sender;
    }

    function mint(address to) public {
        require(counter < 10000, "Max mint reached");
        ITag(erc20).burnFrom(msg.sender, burnAmount);
        counter++;
        super._safeMint(to, counter);
    }

    function _beforeTokenTransfer(
        address from,
        address /* to */,
        uint256 /* tokenId */
    ) internal override view {
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
        transfers++;
        if (transfers == 1337) {
            mintAmount = 69000000000000000000;
        }
    }


    function setOwner (address _owner) public {
        require(owner == msg.sender, 'Only owner can call this function');
        owner = _owner;
    }

    function unlock () public {
        require(owner == msg.sender, 'Only owner can call this function');
        locked = false;
    }
}
