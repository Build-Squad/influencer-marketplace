"use client";

import { Box, Button, Typography } from "@mui/material";
import coinbaseModule from "@web3-onboard/coinbase";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import metamaskSDK from "@web3-onboard/metamask";
import walletConnectModule from "@web3-onboard/walletconnect";

import { useState } from "react";

const Wallets = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const MAINNET_RPC_URL =
    "https://mainnet.infura.io/v3/e9b21e750d854d72b457dd091d1b0fc6";
  const ARBITRUM_RPC_URL =
    "https://arbitrum-mainnet.infura.io/v3/e9b21e750d854d72b457dd091d1b0fc6";

  const injected = injectedModule();
  const coinbase = coinbaseModule();

  const wcInitOptions = {
    projectId: "fa9ffbaaf48751bd2bc165d1d2c8183b",
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
        id: "0x1",
        token: "ETH",
        label: "Ethereum Mainnet",
        rpcUrl: MAINNET_RPC_URL,
      },
      {
        id: 42161,
        token: "ARB-ETH",
        label: "Arbitrum One",
        rpcUrl: ARBITRUM_RPC_URL,
      },
      {
        id: "0xa4ba",
        token: "ARB",
        label: "Arbitrum Nova",
        rpcUrl: "https://nova.arbitrum.io/rpc",
      },
      {
        id: "0x2105",
        token: "ETH",
        label: "Base",
        rpcUrl: "https://mainnet.base.org",
      },
    ],
  });

  const handleConnect = async () => {
    const connectedWallets = await onboard.connectWallet();
    console.log(connectedWallets);
    setWallets(connectedWallets);
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
        </Box>
      )}
    </Box>
  );
};

export default Wallets;
