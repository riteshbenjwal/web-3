import React from 'react';
import WalletContextProvider from './WalletProvider';
import WalletConnector from './components/WalletConnector';
import TokenTransferButton from './components/TokenTransferButton';

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Solana Token Transfer</h1>
        <WalletConnector />
        <TokenTransferButton
          recipientAddress="" // Whom i want to send the tokens
          tokenMintAddress="" // Token address
          amount={1000000} // Amount in lamports , since stable coin usdt have 6 decimals so this is exactly 1
        />
      </div>
    </WalletContextProvider>
  );
};

export default App;
