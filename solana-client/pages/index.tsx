import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
import { PingButton } from '../components/PingButton'
import Head from 'next/head'
import {Input} from "@nextui-org/react";
import { CreateEscrowSolana } from '../components/CreateEscrowSolana'
import { ClaimEscrowSolana } from '../components/ClaimEscrowSolana'

const Home: NextPage = (props) => {

  const sizes = ["sm", "md", "lg"];
  const size = sizes[0];

  let business: string =null;
  let influencer: string = null;
  let lamports: number = null;
  let order_code:number = null;

  const BUSINESS   = `4mc6MJVRgyedZxNwjoTHHkk9G7638GQXFCYmyi3TFuwy`
  const INFLUENCER = `HPJeMLfpswFC7HnTzCKBbwXeGnUiW6M3h1oNmFiCeSNz`
  const amount = 10 ** 7 // 0.1 SOL (10^9 lamports == 1 SOL)
  const LAMPORTS = amount;
  const ORDER_CODE = 125 // THIS MUST BE UNIQUE PER business-influencer (1 transaction at a time) OTHERWISE ERROR

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
           <Input type="address_business" label="Business Address" placeholder="Enter a valid solana address" onChangeCapture={business} />
           <Input type="address_influencer" label="Influencer Address" placeholder="Enter a valid solana address" />
           <Input type="amount_sol" label="Amount Lamports" placeholder="Enter amount of lamports" />
           <Input type="order_number" label="Order Number" placeholder="Enter integer positive number" />
        </div>

        <div className={styles.AppBody}>       
          <CreateEscrowSolana business={business} influencer={influencer} lamports={lamports} order_code={order_code}/>
          <ClaimEscrowSolana business={business} influencer={influencer} lamports={lamports} order_code={order_code} />
        </div>
       
        <div className={styles.AppBody}>     
          <PingButton>Ping Program!</PingButton>  
        </div>

      </WalletContextProvider >

    </div>

  );
}

export default Home;