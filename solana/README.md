# XFluencer Solana Program

## Overview

The program defines a smart contract for an escrow service, where a buyer, seller, and judge are involved in a transaction, and tokens are used as assets.


To build, deploy, and test the Solana program using the Anchor framework, you'll need to follow these steps. Ensure that you have Rust, Anchor CLI, and Solana CLI installed on your machine.

## Installation

First, to the  smart contract is written in Rust, so you will need the Rust complier:

Install `rustc 1.76.0-nightly` version using instructions form Rust docs: https://www.rust-lang.org/tools/install

Due to you are developing in Solana, you need the solana-cli tools.
Use its version `solana-cli 1.17.0` following the instructions at https://docs.solana.com/cli/install-solana-cli-tools which may vary  depending on MacOS, Linux or Windows.

Install Yarn following https://yarnpkg.com/getting-started/install

Now, install Anchor version `0.29.0`. For this you will require `avm`.

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

If you are on Linux (e.g. Ubuntu), you will need the following pre-requisites:

```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```


(for other OS, have a look to https://www.anchor-lang.com/docs/installation)

Now, you can install `avm`

```bash
avm install 0.29.0
```

Select version 
```bash
avm use 0.29.0
```

Check you have the right version `0.29.0`

```bash
anchor --version
```

## Build

To build the Solana program, run the following command:

```bash
anchor build
```

Check you have the files `target/deploy/xfluencer.so` and `target/deploy/xfluencer-keypair.json` 

With the following solana CLI you can check the solana Program ID out of the keypair:

```bash
solana address -k target/deploy/xfluencer-keypair.json 
```

Previous outcome should match the program id specied at `lib.rs` line `declare_id!("<program ID>");`

## Test

Trigger the TS Solana Program test using

```bash
anchor test
```

Check that all test are passed in green.

## Deploy to Devnet

To deploy, you will have to have SOL on your wallet and config solana url to devnet

```bash
solana airdrop 1
solana config set --url devnet
solana config get
```
You should see the RPC of devnet should be selected.

On the `Anchor.toml` change `[program.devent]` address to match your program ID

If you had to change program ID on the Rust code, build again as above and check the keypair.json as above

All the steps are:
```bash
solana config set --url devnet

solana config get

anchor build

solana address -k target/deploy/xfluencer-keypair.json

// Update Anchor.toml and lib.rs w/ new program id.
// Make sure Anchor.toml is on devnet.

// Build again.
anchor build
```

Finally, you are ready to deply to DEVNET with the simple command:

```bash
anchor deploy --provider.cluster devnet
```
After completing 100%, you should see the output "Deploy success".

Finally, check the solana explorer to see your program deployed: https://explorer.solana.com/?cluster=devnet&utm_source=buildspace.so&utm_medium=buildspace_project

## Deploy on Main
[TBC]

