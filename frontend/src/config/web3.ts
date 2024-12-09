import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'viem/chains';
import { http } from 'viem';
import { createConfig } from 'wagmi';

export const config = createConfig(
  getDefaultConfig({
    appName: 'Chat Payment App',
    projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  }),
);

// Contract configuration
export const CONTRACT_ADDRESS = ''; // Will be filled after deployment
export const MESSAGE_COST = '0.001'; // ETH
