import asyncio

from pyxfluencer import validate_escrow_to_cancel, validate_escrow_to_delivered
from pyxfluencer.utils import get_local_keypair_pubkey

class TestValidator:

    def __init__(self,validator_keypair, business, influencer, order_code, network):
        self.validator_keypair = validator_keypair
        self.business = business
        self.influencer = influencer
        self.order_code = order_code
        self.network = network

    async def test_validate_to_delivered_instruction(self):   
        results = await validate_escrow_to_delivered(self.validator_keypair, 
                                                     self.business, 
                                                     self.influencer, 
                                                     self.order_code, 
                                                     self.network)
        print(results)
        
    async def test_validate_to_canel_instruction(self):   
        results = await validate_escrow_to_cancel(self.validator_keypair, 
                                                  self.business, 
                                                  self.influencer, 
                                                  self.order_code, 
                                                  self.network)
        print(results)


path="test_wallets/platform_EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH.json" # path to keypair    
val_auth_keypair,_ = get_local_keypair_pubkey(path="../"+path)

### configure test
bus = '6suvWCcjg5o7xgHrDGc4MXQxraK9PnZyEXzjhhQN6HUK' # business   (put YOURS)
inf = '94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA' # influencer (put YOURS)
order_code=1241  # order code (change this for each escrow order)
network="devnet" # start a local validator for localnet i.e. $ solana-test-validator

test_validator = TestValidator(val_auth_keypair, bus, inf, order_code, network)

asyncio.run(test_validator.test_validate_to_canel_instruction())
#asyncio.run(test_validator.test_validate_to_delivered_instruction())
