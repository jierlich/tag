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

    console.log("Minting initial Tag tokens")
    const mintTx = await tag.connect(deployer).mint(deployer.address, BN('420').mul(oneEther))
    await mintTx.wait()
    console.log(`Minted initial Tag tokens to ${deployer.address}`)

    // Give vault ERC20 minting permissions, revoke others from deployer
    console.log("Granting and revoking roles")
    const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"))
    const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"))
    await tag.connect(deployer).grantRole(
        MINTER_ROLE,
        it.address
    )
    await tag.connect(deployer).renounceRole(
        MINTER_ROLE,
        deployer.address
    )
    const roleTx = await tag.connect(deployer).renounceRole(
        PAUSER_ROLE,
        deployer.address
    )

    await roleTx.wait()
    console.log("Role assignment complete")

    const initialPlayers = [
    ]

    console.log("Sending Its to initial players")
    for(const [index, player] of initialPlayers.entries()) {
        console.log(player)
        console.log(index)
        const txA = await it.connect(deployer).mint(deployer.address)

        await txA.wait()
        const txB = await it.connect(deployer).transferFrom(
            deployer.address,
            player,
            index + 1
        )
        await txB.wait()
    }
    console.log("Game successfully initialized!")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })
