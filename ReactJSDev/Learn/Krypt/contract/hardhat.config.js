require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_API_KEY = "LG4E3_c90lJbAa2Mp-1F2FSK_p8HB0oG";
const SEPOLIA_PRIVATE_KEY = "844a7882c9784670f017bdc269b220e0a9b5779c17aeb8603683d988cbf5a570";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
