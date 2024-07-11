// An async main funtion that deploys the smart contract
const main = async () => {
  const transactions = await hre.ethers.deployContract("Transactions");

  await transactions.waitForDeployment();

  console.log(`Transactions deployed to ${transactions.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
