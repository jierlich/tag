const { expect } = require("chai")
const { ethers } = require("hardhat")

const { keccak256, toUtf8Bytes } = require("ethers/lib/utils")

const BN = ethers.BigNumber.from
// Note: The ether number can represent any 18 decimal token
const oneEther = BN("1000000000000000000")
const zero = BN("0")
const fourTwenty = BN("420").mul(oneEther)

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

        await this.tag.connect(deployer).mint(this.signers[1].address, fourTwenty)

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

    it('burns Tag upon It mint', async () => {
        expect(await this.tag.balanceOf(this.signers[1].address)).to.equal(fourTwenty)
        await this.it.connect(this.signers[1]).mint(this.signers[1].address)
        expect(await this.tag.balanceOf(this.signers[1].address)).to.equal(zero)
        expect(await this.it.ownerOf(1)).to.equal(this.signers[1].address)
    })

    it('fails to mint It without enough Tag', async () => {
        await expect(
            this.it.connect(this.signers[2]).mint(this.signers[1].address)
        ).to.be.revertedWith('ERC20: burn amount exceeds balance')

        await this.tag.connect(this.signers[1]).transfer(this.signers[2].address, fourTwenty)
        expect(await this.tag.balanceOf(this.signers[2].address)).to.equal(fourTwenty)
        await this.it.connect(this.signers[2]).mint(this.signers[2].address)
        expect(await this.tag.balanceOf(this.signers[2].address)).to.equal(zero)
        expect(await this.it.ownerOf(1)).to.equal(this.signers[2].address)
    })
})
