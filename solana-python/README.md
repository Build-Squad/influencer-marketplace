# XFluencer Solana Python Client

This is a static client for XFluencer Solana program generated with anchorpy, containing instructions, accounts and errors for the program.

## Settings

A configuration file `config.json` file is included here, used within scripts. 

This contains instruction arguments, public keys and deployed program id's available on-chain. 

Change this accordantly to your testing requirements.

## Generate Client

Set your prompt at `solana-python`

Create your client, making sure you have the IDL already in place (if not, got to solana folder to generate it)

`$ anchorpy client-gen ../solana/target/idl/xfluencer.json ./pyxfluencer` 

Client will be generated at `pyxfluencer` folder

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


## Usage

TBC
