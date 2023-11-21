/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config()
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    }
  }
};
