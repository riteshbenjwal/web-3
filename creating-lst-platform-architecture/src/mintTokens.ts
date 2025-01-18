import { createBurnCheckedInstruction, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Commitment, Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction, SystemProgram } from "@solana/web3.js";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "./address";
import bs58 from 'bs58';

const private_key = PRIVATE_KEY;

const mint = new PublicKey(TOKEN_MINT_ADDRESS);

const wallet = bs58.decode(private_key as string);

const commitment: Commitment = "confirmed";

const connection = new Connection("https://api.devnet.solana.com", commitment);

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const token_decimals = BigInt(1_000_000);

// Mint tokens to an associated token account
export const mintTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    const mintto = new PublicKey(fromAddress);
    try {
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            mintto,
        );

        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            token_decimals * BigInt(amount),
        );
        console.log(`Success! Minted transaction at ${mintTx}`);
        console.log(`Success! Minted ${amount} tokens to ${ata.address.toBase58()}`);
    } catch (error) {
        console.error("Minting Error:", error);
    }
}

// Burn tokens from an associated token account
export const burnTokens = async (fromAddress: string, amount: number) => {
    const burnAccount = new PublicKey(fromAddress);
    console.log("Burning tokens");

    try {
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            burnAccount,
        );

        const burnTx = createBurnCheckedInstruction(
            ata.address,       // The token account to burn from
            mint,               // The mint address
            keypair.publicKey,  // Owner of the token account
            token_decimals * BigInt(amount),
            Number(token_decimals),
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: keypair.publicKey,
            recentBlockhash: blockhash,
            instructions: [burnTx],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([keypair]);

        const txId = await connection.sendTransaction(transaction, { skipPreflight: false, maxRetries: 5 });
        console.log(`Success! Burn transaction ID: ${txId}`);
    } catch (error) {
        console.error("Burning Error:", error);
    }
}

// Send native SOL tokens
export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    const recipientPubKey = new PublicKey(toAddress);
    console.log("Sending native tokens");

    try {
        const transaction = new VersionedTransaction(new TransactionMessage({
            payerKey: keypair.publicKey,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
                SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: recipientPubKey,
                    lamports: BigInt(amount) * BigInt(1_000_000_000) // Convert SOL to lamports
                })
            ]
        }).compileToV0Message());

        transaction.sign([keypair]);
        const txId = await connection.sendTransaction(transaction, { skipPreflight: false, maxRetries: 5 });
        console.log(`Success! Native transfer transaction ID: ${txId}`);
    } catch (error) {
        console.error("Transfer Error:", error);
    }
}
