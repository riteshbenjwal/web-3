import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  mintTo,
  createAccount,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
} from "@solana/spl-token";

import {
  createInitializeTransferFeeConfigInstruction,
  transferCheckedWithFee,
} from "@solana/spl-token";

import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

import bs58 from "bs58";

import { privateKey, privateKeyString } from "./constants.js";

const extensions = [
  ExtensionType.TransferFeeConfig,
  ExtensionType.MetadataPointer,
];

const DECIMALS = 9;
const FEE_BASIS_POINTS = 50;
const MAX_FEE = BigInt(5_000);

async function initializeConnection() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const privateKey = bs58.decode(privateKeyString);

  const payer = Keypair.fromSecretKey(privateKey);

//   const payer = Keypair.fromSecretKey(Uint8Array.from(privateKey));
  return { connection, payer };
}

async function createTokenMint(connection, payer) {
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  console.log("Mint public key: ", mint.toBase58());

  const transferFeeConfigAuthority = Keypair.generate();
  const withdrawWithheldAuthority = Keypair.generate();

  const metadata = {
    mint: mint,
    name: "DEFI_ADMIN_HERE",
    symbol: "DEFI_ADMIN",
    uri: "https://github.com/saidubundukamara/solana_meta_data/blob/main/metadata.json",
    additionalMetadata: [["description", "Only Possible On Solana"]],
  };

  const mintLen = getMintLen(extensions);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const mintLamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferFeeConfigInstruction(
      mint,
      payer.publicKey,
      payer.publicKey,
      FEE_BASIS_POINTS,
      MAX_FEE,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMetadataPointerInstruction(
      mint,
      payer.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      DECIMALS,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint,
      metadata: metadata.mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
    })
  );

  await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    undefined
  );
  console.log("Mint created: ", mint.toBase58());

  return { mint, mintKeypair };
}

/**
 * Initialize accounts for the token.
 */
async function initializeAccounts(connection, payer, mint) {
  const sourceAccount = await createAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Source account: ", sourceAccount.toBase58());

  const account = Keypair.generate();
  const destinationAccount = await createAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    account,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Destination account: ", destinationAccount.toBase58());

  return { sourceAccount, destinationAccount };
}

/**
 * Mint tokens to the source account.
 */
async function mintTokens(connection, payer, mint, sourceAccount) {
  const mintAmount = BigInt(1_000_000_000_000_000);

  await mintTo(
    connection,
    payer,
    mint,
    sourceAccount,
    payer.publicKey,
    mintAmount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log(`Minted ${mintAmount} tokens to the source account.`);
}

/**
 * Transfer tokens with fees to a destination account.
 */
async function transferTokens(
  connection,
  payer,
  sourceAccount,
  mint,
  destinationAccount
) {
  const transferAmount = BigInt(1_000_000);
  const fee = (transferAmount * BigInt(FEE_BASIS_POINTS)) / BigInt(10_000);
  console.log("Transfer Fee: ", fee);

  await transferCheckedWithFee(
    connection,
    payer,
    sourceAccount,
    mint,
    destinationAccount,
    payer,
    transferAmount,
    DECIMALS,
    fee,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Tokens transferred with fee.");
}

async function main() {
  const { connection, payer } = await initializeConnection();

  const { mint } = await createTokenMint(connection, payer);

  const { sourceAccount, destinationAccount } = await initializeAccounts(
    connection,
    payer,
    mint
  );

  await mintTokens(connection, payer, mint, sourceAccount);

  await transferTokens(
    connection,
    payer,
    sourceAccount,
    mint,
    destinationAccount
  );
}

main();
