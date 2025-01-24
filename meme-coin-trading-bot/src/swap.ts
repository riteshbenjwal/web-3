import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";


const owner = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));

export async function swap(tokenAddress: string, amount: number) {}