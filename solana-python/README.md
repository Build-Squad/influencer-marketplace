# XFluencer Solana Python Client

This is a static client for XFluencer Solana program generated with anchorpy. This containing all the instructions, accounts and errors of the program.

## Settings

Configuration file `config.json` contains public keys of wallets and program ids for testing purposes. This is used by launcher scripts to test the program instructions, i.e. escrow creation, validation and claim amounts. 

You can change this configuration as needed on public keys/keypairs for business, influencer and platform validator. 

As constraint, there will be a unique tupble of data for the program on-change defined by the triplet (busines pubkey, influencer pubkey, order code)

Program Id's are also specified here, depending on the network that has been choosen for deployment.

Change this accounts accordantly depending on your testing requirements.

## Transaction Script Launchers

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

In this folder there are other test launchers for cancel, create and validate.


## Deploying the Python Client

Release the python client in form of python wheel. This allows to work from the API independently to the code changes happened in this repository.

Enter in `setup.py` to change the version number, that will be the wheel version to release. 

Once you have change the settings of the setup, create a version of the package from this folder. 

`python setup.py bdist_wheel`

After changing version number, the package generation the whl package file shoudl be found at `dist/dist/xfluencer_python_client-<version>-py3-none-any.whl `

Replace `version` by tour current version

## Installation of the Python Package

To use previously package wheel, you have to install it as python requirement. 

Install the python package on your environment

`pip install dist/pyxfluencer-<version>-py3-none-any.whl`

Replace `version` by tour current version

## Testing Installation

Open am intereactive python terminal under the virtual environmnet in which the package has been installed

`>> import pyxfluencer`

To see the details of the package under interactive mode type:

`>> help(pyxfluencer)`

Now you should see the name, package contents, and classes included in the package. 
```
Help on package pyxfluencer:

NAME
    pyxfluencer

PACKAGE CONTENTS
    accounts (package)
    errors (package)
    instructions (package)
    program_id
    utils

CLASSES
    enum.Enum(builtins.object)
        EscrowState
    
    class EscrowState(enum.Enum)
     |  EscrowState(value, names=None, *, module=None, qualname=None, type=None, start=1, boundary=None)
     |  
```


## Usage Python Package in the Target

As follows the steps to setup a validator instruction:

1. Install the wheel on your vitual environmet as above installation section

2. Use the right solana network to launch instructions againts e.g. DEVNET
`solana config set --url devnet`

3. Store your wallet that will work as validation authority. 
Find the `json` file containing the seed for `EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH` wallet. Make sure that this is already funded with at leat 1 SOL on Devnet. 

4. Select the business and influencer addressese for the order  (these must be strings)

5. Select the order code (this must be an integer)

6. On your code import the followings

```python
import asyncio

from pyxfluencer import validate_escrow_to_cancel, validate_escrow_to_delivered
from pyxfluencer.utils import get_local_keypair_pubkey
```

Notice, that functions in the library are async so it is necessary to `await` for them.

Follow the example on `test_stand_alone` testing script to either validate an escrow to cancel it or to move it to delivered state.

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
