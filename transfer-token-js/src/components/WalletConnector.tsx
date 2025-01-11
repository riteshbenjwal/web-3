import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnector: React.FC = () => {
  return (
    <div>
      <WalletMultiButton />
    </div>
  );
};

export default WalletConnector;
