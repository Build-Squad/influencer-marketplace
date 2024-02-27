import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'


import { BalanceDisplay } from '../components/BalanceDisplay'

import {NextUIProvider} from "@nextui-org/react";

import { PingButton } from '../components/PingButton'

import Head from 'next/head'
import {Input} from "@nextui-org/react";
import { CreateEscrowSolana } from '../components/CreateEscrowSolana'
import { ClaimEscrowSolana } from '../components/ClaimEscrowSolana'
import { CancelEscrowSolana } from '../components/CancelEscrowSolana'


const Home: NextPage = (props) => {

  const sizes = ["sm", "md", "lg"];
  const size = sizes[0];


  let business: string =null;
  let influencer: string = null;
  let lamports: number = null;
  let order_code:number = null;

  const BUSINESS   = `4mc6MJVRgyedZxNwjoTHHkk9G7638GQXFCYmyi3TFuwy`
  const INFLUENCER = `HPJeMLfpswFC7HnTzCKBbwXeGnUiW6M3h1oNmFiCeSNz`
  const amount = 10 ** 9 // 0.1 SOL (10^9 lamports == 1 SOL)
  const LAMPORTS = amount;
  const ORDER_CODE = 12345 // THIS MUST BE UNIQUE PER business-influencer (1 transaction at a time) OTHERWISE ERROR

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



        <div className={styles.input}>
           <Input type="address_business" label="Business Address" placeholder="Enter a valid solana address" onChangeCapture={business} value={BUSINESS} />
           <Input type="address_influencer" label="Influencer Address" placeholder="Enter a valid solana address" value={INFLUENCER} />
           <Input type="amount_sol" label="Amount Lamports" placeholder="Enter amount of lamports" value={LAMPORTS}/>
           <Input type="order_number" label="Order Number" placeholder="Enter integer positive number" value= {ORDER_CODE}/>
        </div>

        <div className={styles.AppBody}>       
          <CreateEscrowSolana business={BUSINESS} influencer={INFLUENCER} lamports={LAMPORTS} orderCode={ORDER_CODE}/>
          <ClaimEscrowSolana business={BUSINESS} influencer={INFLUENCER} orderCode={ORDER_CODE} />
          <CancelEscrowSolana business={BUSINESS} influencer={INFLUENCER} orderCode={ORDER_CODE} />
        </div>
       

      </WalletContextProvider >

    </div>

  );
}

export default Home;