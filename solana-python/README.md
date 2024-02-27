# XFluencer Solana Python Client

This is a static client for XFluencer Solana program generated with anchorpy, containing instructions, accounts and errors for the program.

## Settings

A configuration file `config.json` file is included here, which is used within client test scripts. 

This contains instruction arguments, public keys and the deployed program id's available on-chain. 

Change this accounts accordantly depending on your testing requirements.


## Transaction Script Launchers

You will find CLI scripts ilustrating how the client and instructions should be used and formed respectively.

To test a specific launcher from CLI, 

Create virtual environment 

`$ virtualenv env --python=python3.11`

Enable the env. 

`$ source env/bin/activate`

Install requirements 

`$ pip install -r requirements.txt`

Check settings at `config.json` are correct and expected

Launch example script:

`$ python launch_create_escrow.py`

You will get an output from the script with Ok or Error, depending on the settings


## Deploying

To create a package from this folder 

`python setup.py bdist_wheel`

After package generation the whl package file shoudl be found at `dist/dist/xfluencer_python_client-1.0.0-py3-none-any.whl `

## Installation

Install the python package on your environment

`pip install dist/pyxfluencer-1.0.0-py3-none-any.whl`


## Update Python Client Source Code

TBC

## Usage

As follows the steps to setup a validator instruction:

1. Install the wheel on your vitual environmet as above installation section
2. Use the right solana network to launch instructions againts e.g. DEVNET
`solana config set --url devnet`

3. Store your wallet that will work as validation authority. Find the `json` file containing the seed for `EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH` wallet. It is already funded with 1 SOL in DEVNET. 

4. Select the business and influencer addressese for the order  (these must be strings)
5. Select the order code (this must be an integer)
6. On your code import the followings

```python
import asyncio

from pyxfluencer import validate_escrow_to_cancel, validate_escrow_to_delivered
from pyxfluencer.utils import get_local_keypair_pubkey`
```

Notice, that functions in the library are asynchronouse so it is necessary to `await` for them.

Follow the example on `test_stand_alone` testing script to either validate an escrow to cancel or to delived

```python
# set path to your json seed file where the keypair of the validator is found.
# this must be funded to pay fees 
path="test_wallets/platform_EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH.json" 
val_auth_keypair,_ = get_local_keypair_pubkey(path="../"+path)
# select business and influencer
business='GQRDv58u1dULSyHSYWPqNTjcWjsFHHi763mbqDaEEgQ3' 
influencer='94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA' 
# select the order code of the escrow previously created 
order_code=1240 # order code
# select network (use solana config set --url devnet)
network="devnet"
# launch the command as follows
test_validator = TestValidator(val_auth_keypair, business, influencer, order_code, network)
asyncio.run(test_validator.test_validate_to_delivered_instruction())
```
