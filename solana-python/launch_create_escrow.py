from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.utils import get_local_keypair_pubkey, select_client, sign_and_send_transaction_sync
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from pyxfluencer.instructions import create_escrow

from config import KeypairPaths, load_configuration

def print_tittle(msg):
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

async def main():
    
    msg = "Create Escrow for Business and Influencer with an amount and an order code"
    print_tittle(msg)
    
    configuration = load_configuration()

    network = configuration["rpc"]["mainnet"]
    
    print("Network selected: ",network)
    client = select_client(network=network, async_client=False)

    
    print(f"Program ID: {PROGRAM_ID}")

    keypair_paths = KeypairPaths()
    
    # @TODO: add to utils a way to get the base58 from keypair
    #validation, validation_authority_pk = get_local_keypair_pubkey(path=keypair_paths.validation_authority)
    #print(validation)  # way to get base58 from keypair seed
        
    _, validation_authority_pk = get_local_keypair_pubkey(path=keypair_paths.validation_authority)
    business, business_pk = get_local_keypair_pubkey() # if no params, takes local keypair (id.json)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    
    assert str(validation_authority_pk) == configuration["platform"]         
    assert str(business_pk) == configuration["business"]["pubkey"]
    assert str(influencer_pk) == configuration["influencer"]["pubkey"]

    ### get account info on tx accounts before sending it
    accounts = [validation_authority_pk,
                business_pk,
                influencer_pk]
    
    for acc in accounts:
        try:
            account_info = client.get_account_info(acc)
            #print(account_info)
            print(f"Sols in {str(acc)}",account_info.value.lamports / 10 ** 8)
        except Exception:
            print("Account not initialized, cannot continue")            
            return 
    
    

    amount = configuration["amount"]["lamports"]
    order_code = configuration["order_code"]

<<<<<<< HEAD

    args = {"amount":int(amount), "order_code":int(order_code)}
=======
    args = {"amount":int(amount),
            "order_code":int(order_code) }
>>>>>>> d9396cde (add python sign and send transaction sync)
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
        
    accounts = {
        "validation_authority": validation_authority_pk,
        "escrow":escrow_pda,         
        "from_":business_pk,
        "to":influencer_pk
        }

    opts = TxOpts(skip_confirmation = False,
                  skip_preflight = False,
                  preflight_commitment="processed")


    print_tittle("Instruction description")   
    
    
    
    
    ix = create_escrow(args, accounts, program_id=PROGRAM_ID)
    
    print(ix)
    
    signers = [business]

<<<<<<< HEAD
    sign_status = await sign_and_send_transaction(ix, signers, network)
=======
    ## forming the transaction
    from solana.transaction import Transaction
    from solana.rpc.core import RPCException
    from solders.compute_budget import set_compute_unit_limit, set_compute_unit_price
    
    tx = Transaction(fee_payer=business_pk, recent_blockhash=None) \
        .add(set_compute_unit_price(1_000)) \
        .add(ix)
>>>>>>> d9396cde (add python sign and send transaction sync)


    #sign_status = await sign_and_send_transaction(ix, signers, opts, network)
    #sign_status = sign_and_send_transaction_sync(ix, signers, opts, network)

    #print(sign_status)
    try:        
        print("Network selected: ",network)
        client = select_client(network=network, async_client=False)
        
        #print("Simulate Transaction")
        #simulate_response = client.simulate_transaction(tx, sig_verify=True)
        #print("Simulate Response", simulate_response)
        
        #print(simulate_response.value.err)
        
        #exit()
        print("Start Sending transactions with options", opts)
                  
        tx_res = client.send_transaction(tx, *signers, opts=opts)
                
        print("Client Response tx signature: ", tx_res)
        
        print("Waiting for transaction confirmation")
        
        signature_status = client.confirm_transaction(tx_res.value)
        
        print("Confirm Transaction Status Value:", signature_status)
        return signature_status.to_json()
    except RPCException as e:        
        raise RPCException(f"RPC exception happened: {e}")

import asyncio

asyncio.run(main())
    
