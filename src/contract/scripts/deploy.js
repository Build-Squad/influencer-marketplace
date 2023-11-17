// scripts/deploy.js
async function main () {
  // We get the contract to deploy
  const Box = await ethers.getContractFactory('Escrow');
  console.log('Deploying Escrow...');
  const box = await Box.deploy();
  await box.deployed();
  console.log('Escrow contract deployed to:', box.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });