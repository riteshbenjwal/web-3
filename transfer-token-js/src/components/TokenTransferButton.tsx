/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback } from 'react';
import {
  PublicKey,
  Transaction
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

interface TokenTransferButtonProps {
  recipientAddress: string;
  tokenMintAddress: string;
  amount: number;
}

const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
  recipientAddress,
  tokenMintAddress,
  amount,
}) => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const {connection } = useConnection();

  const handleTokenTransfer = useCallback(async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet!');
      return;
    }

    try {
      const mintPublicKey = new PublicKey(tokenMintAddress);
      const recipientPublicKey = new PublicKey(recipientAddress);

      const senderATA = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      const recipientATA = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey
      );

      const transaction = new Transaction();

      try {
        const senderAccount = await getAccount(connection, senderATA);
        if (senderAccount.amount < BigInt(amount)) {
          throw new Error('Insufficient token balance');
        }
      } catch (error) {
        throw new Error('Error checking sender token account');
      }

      // Check if recipient's token account exists
      try {
        await getAccount(connection, recipientATA);
      } catch (error) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientATA,
            recipientPublicKey,
            mintPublicKey
          )
        );
      }

      const transferInstruction = createTransferCheckedInstruction(
        senderATA,
        mintPublicKey,
        recipientATA,
        publicKey,
        amount,
        6  // decimals for USDC/USDT
      );

      transaction.add(transferInstruction);

      // Get latest block hash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

     console.log(`Transaction successful! Signature: ${signature}`);

    } catch (error: any) {
      console.log('Error during token transfer:', error);
    }
  }, [connected, publicKey, tokenMintAddress, recipientAddress, amount, connection, sendTransaction]);

  return (
    <button
      onClick={handleTokenTransfer}
      disabled={!connected}
      style={{
        padding: '12px 24px',
        marginTop: '20px',
        backgroundColor: connected ? '#4CAF50' : '#cccccc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: connected ? 'pointer' : 'not-allowed',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}
      onMouseOver={(e) => {
        if (connected) {
          e.currentTarget.style.backgroundColor = '#45a049';
        }
      }}
      onMouseOut={(e) => {
        if (connected) {
          e.currentTarget.style.backgroundColor = '#4CAF50';
        }
      }}
    >
      Transfer Token
    </button>
  );
};

export default TokenTransferButton;