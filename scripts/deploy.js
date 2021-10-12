const { keccak256, toUtf8Bytes } = require("ethers/lib/utils")
const { ethers } = require("hardhat");
const BN = ethers.BigNumber.from

const oneEther = BN("1000000000000000000")

async function main() {
    const [ deployer ] = await ethers.getSigners();

    // Create Tag
    console.log(`Tag is being deployed by ${deployer.address}`)
    const TagFactory = await ethers.getContractFactory("Tag", deployer)
    const tag = await TagFactory.deploy("Tag", "TAG")
    console.log("Tag address:", tag.address)

    // Create It
    console.log(`It is being deployed by ${deployer.address}`)
    const ItFactory = await ethers.getContractFactory("It", deployer)
    const it = await ItFactory.deploy("It", "IT", tag.address)
    console.log("It address:", it.address)

    await tag.connect(deployer).mint(deployer.address, BN('420').mul(oneEther))

    // Give vault ERC20 minting permissions, revoke others from deployer
    const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"))
    const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"))
    await tag.connect(deployer).grantRole(
        MINTER_ROLE,
        it.address
    )
    tag.connect(deployer).renounceRole(
        MINTER_ROLE,
        deployer.address
    )
    tag.connect(deployer).renounceRole(
        PAUSER_ROLE,
        deployer.address
    )
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })
