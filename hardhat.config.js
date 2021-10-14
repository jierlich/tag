require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const environment = require("./environment")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    matic_mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${environment.alchemyAPIKey}`,
      accounts: [environment.deployerPK]
    },
    matic_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${environment.alchemyAPIKey}`,
      accounts: [environment.deployerPK]
    }
  },
  solidity: {
    version: "0.8.4",
    optimizer: {
      enabled: true,
      runs: 1_000_000
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  etherscan: {
    apiKey: environment.etherscanAPIKey
  }
};
