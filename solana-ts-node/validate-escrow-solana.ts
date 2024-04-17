import {
    ComputeBudgetProgram,
    ConfirmOptions,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SendTransactionError,
    Transaction,
    VersionedTransaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js"

import * as anchor from "@coral-xyz/anchor";

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";

const idl = require('./xfluencer.json');
const configuration = require('./config.json')


function getRawTransaction(
    encodedTransaction: string
): Transaction | VersionedTransaction {
    let recoveredTransaction: Transaction | VersionedTransaction;
    try {
        recoveredTransaction = Transaction.from(
            Buffer.from(encodedTransaction, 'base64')
        );
    } catch (error) {
        recoveredTransaction = VersionedTransaction.deserialize(
            Buffer.from(encodedTransaction, 'base64')
        );
    }
    return recoveredTransaction;
}


async function signTransaction(
    connection: Connection,
    encodedTransaction: string,
    feePayer: Keypair): Promise<any> {
    try {

        const recoveredTransaction = getRawTransaction(encodedTransaction);

        if (recoveredTransaction instanceof VersionedTransaction) {
            recoveredTransaction.sign([feePayer]);
        } else {
            recoveredTransaction.partialSign(feePayer);
        }

        const txnSignature = await connection.sendRawTransaction(
            recoveredTransaction.serialize(),
            {
                skipPreflight: false,
                preflightCommitment: 'finalized' 
            }
        );     
        
        return txnSignature;

    } catch (error) {
        return error
    }
}

const sleep = async (ms: number) => {
    return new Promise(r => setTimeout(r,ms))
};



const isValidSignature = async (connection: Connection, sig: string) => {
    const status = await connection.getSignatureStatus(sig, {
      searchTransactionHistory: true,
    });
    return (
      status.value?.err === null &&
      status.value?.confirmationStatus === "finalized"
    );
  };


export const validateEscrowSolana = async (
    rpc: string,
    validator: string,
    business: string,
    influencer: string,
    orderCode: number,
    targetState: number,
    percentageFee: number = 0) => {

    const commitment = configuration.commitment;
    const confirmation = configuration.confirmTransactionInitialTimeout;

    console.log("Rpc selected:", rpc)
    console.log("Commitment:", commitment)
    console.log("Confirmation Time:", confirmation)

    let connection = new Connection(rpc,
        {
            commitment: configuration.commitment,
            confirmTransactionInitialTimeout: configuration.confirmation
        });

    const validatorPublicKey: PublicKey = new PublicKey(validator);
    const businessPublicKey: PublicKey = new PublicKey(business);
    const influencerPublicKey: PublicKey = new PublicKey(influencer);

    const programId = new PublicKey(idl.metadata.address);
    const program = new anchor.Program(idl as anchor.Idl, programId, { connection });

    const [escrowPDA] = await PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        businessPublicKey.toBuffer(),
        influencerPublicKey.toBuffer(),
        utf8.encode(orderCode.toString())
    ],
        programId
    );

    console.log("Address of Escrow PDA", escrowPDA.toString())

    const ix = await program.methods.validateEscrowSol(
        new anchor.BN(targetState),
        new anchor.BN(percentageFee)
    ).accounts({
        validationAuthority: validatorPublicKey,
        influencer: influencerPublicKey,
        business: businessPublicKey,
        escrowAccount: escrowPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
    }).instruction();

    //const recentPriorityFee = await connection.getRecentPrioritizationFees()

    const PRIORITY_RATE = 500000; // MICRO_LAMPORTS
    const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_RATE
    });

    console.log("Set priority fees to: ", PRIORITY_RATE);

    const cuSet = 200_000;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: cuSet,
    });

    console.log("Computer Units set", cuSet);

    const tx = new Transaction()
        .add(ix)
        .add(PRIORITY_FEE_IX)
        .add(modifyComputeUnits);

    const signer = Keypair.fromSecretKey(new Uint8Array(configuration["platformSecret"]));
    tx.feePayer = signer.publicKey;

   

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;
    console.debug("blockhash",blockhash, " lastValidBlockHeight",lastValidBlockHeight)


    const serializedTransaction = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: true
    });

    const transactionBase64 = serializedTransaction.toString('base64');



    let blockheight = await connection.getBlockHeight();

    console.debug("blockheight", blockheight, " lastValidBlockHeight",lastValidBlockHeight)
    console.debug("# Slots to Send Transaction:",lastValidBlockHeight-blockheight);
    let txnSignature: any = null;
    try {
        console.log("Signing Transaction")
        txnSignature
            = await signTransaction(connection, transactionBase64, signer)

        if(txnSignature instanceof SendTransactionError) {            
            return {"status":txnSignature?.name, 
                    "msg": txnSignature?.message, 
                    "logs": txnSignature?.logs}
        }
    } catch(error) {
        return {"status":"Internal Error", 
                "msg": "Error signing and sending transactio"}
    }

    let waitingTimeMiliSeconds = 1000;

    console.log("Transaction Signature Sent:",txnSignature)

    console.log("Confirming Transaction");
    await sleep(waitingTimeMiliSeconds);

    const isValidSig = await isValidSignature(connection,txnSignature)
        if (isValidSig != false) { return "OK!!"}
        console.log("Not valid signature yet isValidSig",isValidSig);

    console.debug("re-tring with", configuration.rpc[0])
    let cumWaitingtime = 0;
    while (blockheight < lastValidBlockHeight) {
    
        console.debug("Waiting for",waitingTimeMiliSeconds,"ms to re-try",
                      "Total time waiting",cumWaitingtime,"ms",
                      "Current Blockheight:",blockheight,
                      "Slots Left:",lastValidBlockHeight-blockheight)

       // 0: quick-node 1: helius 2: hellomoon 
        await sleep(waitingTimeMiliSeconds);
        cumWaitingtime += waitingTimeMiliSeconds;
        //console.debug("re-tring with", configuration.rpc[0])
        await signTransaction(configuration.rpc[0], transactionBase64, signer)
        //await sleep(waitingTimeMiliSeconds);
        //console.debug("re-tring with", configuration.rpc[1])
        //await signTransaction(configuration.rpc[1], transactionBase64, signer)
        //await sleep(waitingTimeMiliSeconds);
        //console.debug("re-tring with", configuration.rpc[2])
        //await signTransaction(configuration.rpc[2], transactionBase64, signer)
        //await sleep(waitingTimeMiliSeconds);
        //console.debug("re-tring with", configuration.rpc[3])
        //await signTransaction(configuration.rpc[3], transactionBase64, signer)
    
        blockheight = await connection.getBlockHeight();
        const isValidSig = await isValidSignature(connection,txnSignature)
        if (isValidSig != false) { 
            return {
                "status":"Ok", 
                "signature":txnSignature} 
            }        
    }

    return {"status":"Error", 
            "msg":"Custom re-try failed. Expired blockheich exceedeed error",
            "signature":txnSignature}

}


(async () => {

    console.debug("Inputs argv:", process.argv[2])

    const args = JSON.parse(process.argv[2]);

    const business = args?.bus; 
    const influencer = args?.inf; 
    const orderCode = args?.oc;
    const targetState = Number(args?.ts);

    const rpc = configuration.rpc[0]; // 0: quick-node 1: helius 2: hellomoon    
    const validator = configuration["platformValidator"]
    const percentageFee = configuration["platformPercentageFee"];

    //const business = `GQRDv58u1dULSyHSYWPqNTjcWjsFHHi763mbqDaEEgQ3`
    //const influencer = `94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA`
    //const orderCode = 12354;
    //const targetState = 2; // targets 1 (cancel) or 2 (deliver)

    console.info("Business Address:", business);
    console.info("Influencer Address:", influencer);
    console.info("Escrow OrderCode (intenger): ", orderCode);
    console.info("targetState (1) Cancel to Business (2) Deliver to Influencer: ", targetState);
    console.info("PercentageFee - Integer from 0 to 500 (0.00 %-5.00 %): ", percentageFee);

    const response = await validateEscrowSolana(rpc,
        validator,
        business,
        influencer,
        orderCode,
        targetState,
        percentageFee);   

    console.info(response)
    return response
})()


