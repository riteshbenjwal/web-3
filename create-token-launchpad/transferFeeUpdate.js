import {
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    Connection,
  } from "@solana/web3.js";
  import {
    createSetTransferFeeInstruction,
    TOKEN_2022_PROGRAM_ID,
  } from "@solana/spl-token";
  
  /**
   * Updates the transfer fee for a token mint.
   *
   * @param {Connection} connection - Solana connection instance.
   * @param {Keypair} payer - Keypair of the wallet performing the transaction.
   * @param {PublicKey} mint - Public key of the token mint.
   * @param {number} transferFeeBasisPoints - New transfer fee in basis points.
   * @param {bigint} maximumFee - Maximum fee in smallest unit of the token.
   */
  export const updateTransferFee = async (
    connection,
    payer,
    mint,
    transferFeeBasisPoints,
    maximumFee
  ) => {
    try {
      console.log(`Updating transfer fee for mint: ${mint.toBase58()}`);
  
      const setTransferFeeInstruction = createSetTransferFeeInstruction(
        mint,
        payer.publicKey,
        [payer],
        transferFeeBasisPoints,
        maximumFee,
        TOKEN_2022_PROGRAM_ID
      );
  
      const transaction = new Transaction().add(setTransferFeeInstruction);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
  
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer.publicKey;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
  
      const signature = await sendAndConfirmTransaction(connection, transaction, [
        payer,
      ]);
  
      console.log("Transfer fee updated successfully. Transaction signature:", signature);
    } catch (error) {
      console.error("Failed to update transfer fee:", error);
      throw error;
    }
  };
  