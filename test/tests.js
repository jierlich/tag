const { expect } = require("chai")
const { ethers } = require("hardhat")

const { keccak256, toUtf8Bytes } = require("ethers/lib/utils")

const BN = ethers.BigNumber.from
// Note: The ether number can represent any 18 decimal token
const oneEther = BN("1000000000000000000")

describe("Tag game", () => {
    beforeEach(async () => {
        this.signers = await ethers.getSigners();
        const deployer = this.signers[0]

        // Create Tag
        const TagFactory = await ethers.getContractFactory("Tag", deployer)
        this.tag = await TagFactory.deploy("Tag", "TAG")

        // Create It
        const ItFactory = await ethers.getContractFactory("It", deployer)
        this.it = await ItFactory.deploy("It", "IT", this.tag.address)

        await this.tag.connect(deployer).mint(this.signers[1].address, BN('420').mul(oneEther))

        // Give vault ERC20 minting permissions, revoke others from deployer
        const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"))
        const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"))
        await this.tag.connect(deployer).grantRole(
            MINTER_ROLE,
            this.it.address
        )
        this.tag.connect(deployer).renounceRole(
            MINTER_ROLE,
            deployer.address
        )
        this.tag.connect(deployer).renounceRole(
            PAUSER_ROLE,
            deployer.address
        )
    })

    it('test case', async () => {

    })
})
