import * as anchor from "@coral-xyz/anchor";

import idl from "./xfluencer.json";

import { Connection, PublicKey } from "@solana/web3.js";

export const getAnchorProgram = (connection: Connection): anchor.Program => {
  const programId = new PublicKey(idl.metadata.address);
  const program = new anchor.Program(idl as anchor.Idl, programId, {
    connection,
  });
  return program;
};
