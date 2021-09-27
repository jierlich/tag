// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface ITag {
    function mint(address, uint256) external;
    function burnFrom(address, uint256) external;
}