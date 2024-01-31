import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
import { BalanceDisplay } from '../components/BalanceDisplay'
import { PingButton } from '../components/PingButton'
import Head from 'next/head'
import { CreateEscrow } from '../components/CreateEscrow'

import {NextUIProvider} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

const Home: NextPage = (props) => {

  const sizes = ["sm", "md", "lg"];
  const size = sizes[0];

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
          <PingButton />
        </div>


        <div className={styles.input}>
           <Input type="address" label="Buyer Address" 
                placeholder="Enter your solana address" />
        </div>

        <div className={styles.input}>
           <Input type="address" label="Seller Address" placeholder="Enter your solana address" />
        </div>

        <div className={styles.input}>
           <Input type="address" label="Judge Address" placeholder="Enter your solana address" />
        </div>

        <div className={styles.input}>
           <Input type="address" label="Mint Account" placeholder="Enter your token mint" />
        </div>

        <div className={styles.input}>
           <Input type="address" label="Amount to Send" placeholder="Enter your tokens" />
        </div>



        <div className={styles.AppBody}>       
          <CreateEscrow />
        </div>



      </WalletContextProvider >

    </div>

  );
}

export default Home;