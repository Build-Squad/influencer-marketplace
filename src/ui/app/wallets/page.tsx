"use client";

import { Box, Button, Typography } from "@mui/material";
import coinbaseModule from "@web3-onboard/coinbase";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import metamaskSDK from "@web3-onboard/metamask";
import walletConnectModule from "@web3-onboard/walletconnect";
import ABI from "../../src/abis/Escrow.json";

import { ethers } from "ethers";
import { useState } from "react";

const Wallets = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS || "";

  const injected = injectedModule();
  const coinbase = coinbaseModule();

  const wcInitOptions = {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  };

  const metamask = metamaskSDK({
    options: {
      extensionOnly: false,
      dappMetadata: {
        name: "Demo Web3Onboard",
      },
    },
  });

  const walletConnect = walletConnectModule(wcInitOptions);
  const onboard = Onboard({
    wallets: [coinbase, walletConnect, metamask, injected],
    chains: [
      {
        id: "0xaa36a7",
        token: "ETH",
        label: "Sepolia",
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_INFURA_LINK || "",
      },
    ],
  });

  const handleConnect = async () => {
    const connectedWallets = await onboard.connectWallet();
    console.log(connectedWallets);
    setWallets(connectedWallets);
  };

  const handleContractConnect = async () => {
    const ethersProvider = new ethers.BrowserProvider(wallets[0].provider);
    const signer = await ethersProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log(contract);
    const transaction = await contract.initiateTransaction(
      process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS || "",
      ethers.parseEther("0.0001"),
      {
        value: ethers.parseEther("0.0002"),
      }
    );
  };

  function getElement(wallet: any) {
    return (
      <>
        <Typography variant="h5" sx={{ color: "secondary.main" }}>
          {wallet.label}
        </Typography>
        {wallet?.accounts?.map((account: any) => {
          return (
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              {account?.address}
            </Typography>
          );
        })}
      </>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fefefe",
      }}
    >
      <Button onClick={handleConnect} variant="contained" color="primary">
        Connect Wallets
      </Button>
      {wallets.length > 0 /* New */ && (
        <Box>
          <Typography variant="h4" sx={{ color: "primary.main" }}>
            Wallets
          </Typography>
          {wallets.map((wallet: any) => getElement(wallet))}
          <Button
            onClick={() => {
              handleContractConnect();
            }}
            variant="outlined"
            color="secondary"
          >
            <Typography variant="h6">Initiate Transaction</Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Wallets;
