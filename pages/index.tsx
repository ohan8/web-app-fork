/**
 * Website's home page
 */
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Gear from '../public/gear.png';

const Home: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Upper Room Media</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/upper_room_media_icon.png" />
    </Head>
    <div className={styles.rotating}>
      <Image src={Gear} height={300} width={300} />
    </div>
    <h1 className={styles.loading}>Work in progress</h1>
  </div>
);

export default Home;
