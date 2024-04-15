import React from "react";
import { NextPage } from 'next'
import Head from 'next/head'
import { Input } from "@nextui-org/react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'

// import components to support escrow using sol
import { CreateEscrowSolana } from '../components/CreateEscrowSolana'
import { ClaimEscrowSolana } from '../components/ClaimEscrowSolana'
import { CancelEscrowSolana } from '../components/CancelEscrowSolana'
import { Validate } from '../components/Validate'

// import components to support escrows using spl
import { CreateEscrowSpl } from '../components/CreateEscrowSpl'
import { CancelEscrowSpl } from '../components/CancelEscrowSpl'
import { ValidateEscrowSpl } from '../components/ValidateEscrowSpl'
import { ClaimEscrowSpl } from '../components/ClaimEscrowSpl'



const Home: NextPage = (props) => {

  //// CHANGE THESE ADDRESSED TO CONFIGURE THE XFLUENCER MOCK //////
  const MINT: string = `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr`;

  const VALIDATOR: string = `EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH`;
  //const BUSINESS: string = `EBBRDuAZVf2XHJsQwzZqwPLF64cKC8SbaukL3H19nX2Q`;
  const BUSINESS: string = `GQRDv58u1dULSyHSYWPqNTjcWjsFHHi763mbqDaEEgQ3`

  //const INFLUENCER: string = `4AxvMsyEv5X3ioHuguaAk4ETsCQ6AWDpjgzNEUckaDEx`;
  const INFLUENCER: string = `94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA`

  //////////////////////////////////////////////////////////////////
  const NUM_SOLS: number = 0.001;
  const LAMPORTS: number = NUM_SOLS * LAMPORTS_PER_SOL; // (10^9 lamports == 1 SOL)
  const ORDER_CODE: number = 12354 // THIS MUST BE UNIQUE PER business-influencer (1 transaction at a time) OTHERWISE ERROR
  const NUM_SPL_TOKENS: number = 1000000; // 6 decimals ==> 10 ** 6 == 1 Token Unit
  const PERCENTAGE_FEE: number = 0;


  const NETWORK = "https://bold-hidden-glade.solana-mainnet.quiknode.pro/bcd715dccef5e699ea43459b691a09c2bc8dc474"

  return (
    <div className={styles.App}>

      <Head>
        <title>XFluencer Mock</title>
        <meta
          name="description"
          content="Mocking XFluencer On Solana Program"
        />
      </Head>


      <WalletContextProvider>
        <AppBar />

        <div className={styles.AppBody}>
          Set Authority of the Escrows
        </div>

        <div className={styles.input}>
          <Input type="validator_authority" label="validator Authority"
            placeholder="Enter a valid solana address"
            value={VALIDATOR} />
        </div>

        <div className={styles.AppBody}>
          Mocking Escrows Using Solana Tokens
        </div>

        <div className={styles.input}>
          <Input type="address_business" label="Business Address"
            placeholder="Enter a valid solana address"
            value={BUSINESS} />

          <Input type="address_influencer" label="Influencer Address"
            placeholder="Enter a valid solana address"
            value={INFLUENCER} />

          <Input type="amount_sol" label="Amount Lamports"
            placeholder="Enter amount of lamports"
            value={LAMPORTS} />

          <Input type="order_number" label="Order Number"
            placeholder="Enter integer positive number"
            value={ORDER_CODE} />

          <Input type="percentage_fee" label="Percentage Fee"
            placeholder="Enter integer positive number"
            value={PERCENTAGE_FEE} />

        </div>

        <div className={styles.AppBody}>
          <CreateEscrowSolana validator={VALIDATOR}
            business={BUSINESS}
            influencer={INFLUENCER}
            lamports={LAMPORTS}
            orderCode={ORDER_CODE} 
            network={NETWORK}/>

          <CancelEscrowSolana business={BUSINESS} 
                              influencer={INFLUENCER} 
                              orderCode={ORDER_CODE} 
                              network={NETWORK}/>

          <Validate validator={VALIDATOR}
            business={BUSINESS}
            influencer={INFLUENCER}
            percentageFee={0}
            orderCode={ORDER_CODE}
            targetState={1}
            textButton={"Validate Escrow Cancel"}
            network={NETWORK} />

          <Validate validator={VALIDATOR} 
            business={BUSINESS} 
            influencer={INFLUENCER} 
            percentageFee={0}
            orderCode={ORDER_CODE} 
            targetState={2} 
            textButton={"Validate Escrow Delivery"}
            network={NETWORK} />

          <ClaimEscrowSolana business={BUSINESS} 
                             influencer={INFLUENCER} 
                             orderCode={ORDER_CODE}
                             network={NETWORK} />
        </div>

        <div className={styles.AppBody}>
          Mocking Escrows Using SPL Tokens
        </div>

        <div className={styles.input}>
          <Input type="address_business" label="Business Address"
            placeholder="Enter a valid solana address"
            value={BUSINESS} />

          <Input type="address_influencer" label="Influencer Address"
            placeholder="Enter a valid solana address"
            value={INFLUENCER} />

          <Input type="order_number" label="Order Number"
            placeholder="Enter integer positive number"
            value={ORDER_CODE} />

          <Input type="mint" label="Mint"
            placeholder="Enter a valid solana address"
            value={MINT} />

          <Input type="tokens" label="Num. SPL Tokens times 10 ^ decimals "
            placeholder="Enter a valid solana address"
            value={NUM_SPL_TOKENS} />


        </div>


        <div className={styles.AppBody}>
          <CreateEscrowSpl validator={VALIDATOR}
            business={BUSINESS}
            influencer={INFLUENCER}
            mint={MINT}
            tokens={NUM_SPL_TOKENS}
            orderCode={ORDER_CODE} />

          <CancelEscrowSpl business={BUSINESS}
            validatorAuthority={VALIDATOR}
            mintTokenAccount={MINT}
            orderCode={ORDER_CODE} />

          <ValidateEscrowSpl
            validator={VALIDATOR}
            business={BUSINESS}
            influencer={INFLUENCER}
            percentageFee={0}
            orderCode={ORDER_CODE}
            targetState={1}
            textButton={"Validate Escrow Cancel with Fee 0%"} />

          <ValidateEscrowSpl
            validator={VALIDATOR}
            business={BUSINESS}
            influencer={INFLUENCER}
            percentageFee={0}
            orderCode={ORDER_CODE}
            targetState={2}
            textButton={"Validate Escrow Delivery with Fee 0%"} />



          <ClaimEscrowSpl business={BUSINESS}
            influencer={INFLUENCER}
            validatorAuthority={VALIDATOR}
            mintTokenAccount={MINT}
            orderCode={ORDER_CODE} 
            network={NETWORK} />


        </div>

      </WalletContextProvider >

    </div>

  );
}

export default Home;