// scripts/deploy.js
async function main () {
  // We get the contract to deploy
  const Escrow = await ethers.getContractFactory('Escrow');
  console.log('Deploying Escrow...');
  const escrow = await Escrow.deploy(process.env.PLATFORM_ADDRESS);
  await escrow.deployed();
  console.log('Escrow contract deployed to:', escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });