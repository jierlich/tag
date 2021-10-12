// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ITag.sol";

/// @title If you own an It, you're it
/// @author jierlich
/// @notice Until unlock this can only be transferred by the holder
contract It is ERC721 {
    /// @dev number of Its minted
    uint public counter = 0;

    /// @dev count of number of transfers of any It
    uint public transfers = 0;
    /// @dev Tag tokens minted when an It is transferred
    uint public mintAmount = 420000000000000000000;
    /// @dev Tag tokens that must be burned to mint an It
    uint constant burnAmount = 420000000000000000000;
    /// @dev when true users can not approve others for transferring a token
    bool public locked = true;

    /// @dev address of the Tag token
    address public erc20;

    /// @dev contract owner
    address public owner;

    /// @param _name name of the ERC721
    /// @param _symbol symbol of the ERC721
    /// @param _erc20 address of the associated ERC20
    constructor(string memory _name, string memory _symbol, address _erc20) ERC721(_name, _symbol) {
        erc20 = _erc20;
        owner = msg.sender;
    }

    /// @notice mints a new It
    /// @param to receiver of the newly minted It
    function mint(address to) public {
        require(counter < 10000, "Max mint reached");
        ITag(erc20).burnFrom(msg.sender, burnAmount);
        counter++;
        super._safeMint(to, counter);
    }

    /// @notice hook before transfer events to block approved transfers by others before unlock
    /// @param from holder of token before transfer
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

    /// @notice Mints Tag tokens to the sender upon transfer
    /// @param from holder of token before transfer
    /// @param to holder of token after transfer
    /// @param tokenId id of the It to transfer
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._transfer(from, to, tokenId);
        /// @dev reward transfer with tokens if there are remaining Its to mint
        if (counter < 10000) {
            ITag(erc20).mint(from, mintAmount);
        }
        transfers++;
        if (transfers == 1337) {
            mintAmount = 69000000000000000000;
        }
    }

    /// @notice change the owner of the contract
    /// @param _owner new owner
    function setOwner (address _owner) public {
        require(owner == msg.sender, 'Only owner can call this function');
        owner = _owner;
    }

    /// @notice unlock the contract so It's can be approved for transfer
    function unlock () public {
        require(owner == msg.sender, 'Only owner can call this function');
        locked = false;
    }
}
