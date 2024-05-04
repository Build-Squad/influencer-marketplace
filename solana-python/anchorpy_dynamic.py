from pathlib import Path
import asyncio
import json
from solders.pubkey import Pubkey
from anchorpy import Idl, Program

async def main():
    # Read the generated IDL.
    with Path("xfluencer.json").open() as f:
        raw_idl = f.read()
    idl = Idl.from_json(raw_idl)
    # Address of the deployed program.
    program_id = Pubkey.from_string(idl.metadata['address'])
    # Generate the program client from IDL.
    async with Program(idl, program_id) as program:
        # Execute the RPC.
        await program.rpc["initialize"]()
    # If we don't use the context manager, we need to
    # close the underlying http client, otherwise we get warnings.
    await program.close()

asyncio.run(main())