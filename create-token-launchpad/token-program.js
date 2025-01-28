import {
    clusterApiUrl,
    Connection,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  import bs58 from "bs58";
import { privateKeyString } from "./constants.js";
  
  
  async function main() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log("Connection to cluster established.");
  
    // Decode private key and create a Keypair for the payer
    const privateKey = bs58.decode(privateKeyString);
    const payer = Keypair.fromSecretKey(privateKey);
  
    // Airdrop SOL to the payer if needed
    const balance = await connection.getBalance(payer.publicKey);
    if (balance < 2 * LAMPORTS_PER_SOL) {
      console.log("Airdropping SOL...");
      const signature = await connection.requestAirdrop(
        payer.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
      console.log("Airdrop completed.");
    }
  
    // Create a new mint
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, 
      null,
      9 
    );
    console.log("Mint public key: ", mint.toBase58());
  
    // Create associated token accounts
    const sourceAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey // Owner of the account
    );
    console.log("Source account: ", sourceAccount.address.toBase58());
  
    const destinationAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey // Owner of the destination account
    );
    console.log("Destination account: ", destinationAccount.address.toBase58());
  
    const mintAmount = 1000000000000000000; // 10 tokens with 9 decimals
    await mintTo(
      connection,
      payer,
      mint,
      sourceAccount.address,
      payer.publicKey,
      mintAmount
    );
    console.log(`Minted ${mintAmount} tokens to the source account.`);
  
    // const transferAmount = 10000000000;
    // const tx = new Transaction().add(
    //   transfer(
    //     sourceAccount.address,
    //     destinationAccount.address,
    //     payer.publicKey,
    //     transferAmount,
    //     [],
    //     TOKEN_PROGRAM_ID
    //   )
    // );
    // await sendAndConfirmTransaction(connection, tx, [payer]);
    // console.log(
    //   `Transferred ${transferAmount} tokens from source to destination.`
    // );
  }
  
  main().catch((error) => {
    console.error("Error: ", error);
  });
  