import {
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    Connection,
  } from "@solana/web3.js";
  import {
    createSetAuthorityInstruction,
    AuthorityType,
    TOKEN_2022_PROGRAM_ID,
  } from "@solana/spl-token";
  
  /**
   * Updates the authorities for a token mint.
   *
   * @param {Connection} connection - Solana connection instance.
   * @param {Keypair} payer - Keypair of the wallet performing the transaction.
   * @param {PublicKey} mint - Public key of the token mint.
   * @param {PublicKey|null} newTransferFeeConfigAuthority - New transfer fee config authority (optional).
   * @param {PublicKey|null} newWithdrawWithheldAuthority - New withdraw withheld authority (optional).
   */
  export const updateAuthorities = async (
    connection,
    payer,
    mint,
    newTransferFeeConfigAuthority = null,
    newWithdrawWithheldAuthority = null
  ) => {
    try {
      console.log(`Updating authorities for mint: ${mint.toBase58()}`);
  
      const transaction = new Transaction();
  
      // Update Transfer Fee Config Authority if provided
      if (newTransferFeeConfigAuthority) {
        const transferFeeConfigInstruction = createSetAuthorityInstruction(
          mint,
          payer.publicKey,
          AuthorityType.TransferFeeConfig,
          newTransferFeeConfigAuthority,
          [],
          TOKEN_2022_PROGRAM_ID
        );
        transaction.add(transferFeeConfigInstruction);
      }
  
      // Update Withdraw Withheld Authority if provided
      if (newWithdrawWithheldAuthority) {
        const withdrawWithheldInstruction = createSetAuthorityInstruction(
          mint,
          payer.publicKey,
          AuthorityType.WithheldWithdraw,
          newWithdrawWithheldAuthority,
          [],
          TOKEN_2022_PROGRAM_ID
        );
        transaction.add(withdrawWithheldInstruction);
      }
  
      if (transaction.instructions.length === 0) {
        console.log("No authorities to update.");
        return;
      }
  
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
  
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer.publicKey;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
  
      const signature = await sendAndConfirmTransaction(connection, transaction, [
        payer,
      ]);
  
      console.log("Authorities updated successfully. Transaction signature:", signature);
    } catch (error) {
      console.error("Failed to update authorities:", error);
      throw error;
    }
  };
  