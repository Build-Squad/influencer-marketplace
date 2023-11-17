## PoC: Escrow System in a Smart Contract

#### Note: This is an initial PoC for general understanding of how a smart contract for an escrow system would look like and how it would work. This is not the actual implementation.

#### Tools Required::
+ Hardhat (https://hardhat.org/)
+ NodeJS 

#### Steps to run the project:
1. Go to Project Directory:  
``` cd src/contract```  
2. Install Hardhat (Globally or locally):  
``` npm install -g hardhat ```  
``` npm install --save-dev hardhat ```  
3. Install Dependencies:  
``` npm install ```
4. Start a local Hardnet network:  
``` npx hardhat node ```  
+ Note: Keep this process running in a separate terminal window as this is the local blockchain network on which the smart contract will be deployed and on each restart of this process, the blockchain will be reset.
5. To compile and deploy the contracts on a local Hardnet network:  
``` npx hardhat run --network localhost scripts/deploy.js ```
6. The above command will deploy the contract and will return the contract address. The contract address can then be used to testing the contract.

#### References:
+ https://hardhat.org/hardhat-runner/docs/getting-started
+ https://docs.openzeppelin.com/contracts/5.x/
+ https://docs.replit.com/tutorials/web3/escrow-contract-with-solidity

#### Next Steps:
+ Test Run the contract on the local blockchain network as well as on a Testnet (Goerli, etc.)
+ Use ```web3.js``` or ```web3.py``` to interact with the contract.