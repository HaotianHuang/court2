import React from 'react'
import ReactDOM from 'react-dom/client'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from 'viem'
import App from './App'
import './index.css'

// Define Base Sepolia chain
const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia-explorer.base.org' },
  },
  testnet: true,
})

// Setup queryClient
const queryClient = new QueryClient()

// Project ID from Reown Cloud
const projectId = 'f2d99fc410867a1eec6fafeef2c09779'

// Metadata for the app
const metadata = {
  name: 'Chat Payment App',
  description: 'Chat app with Gemini AI and Web3 payments',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [baseSepolia],
  projectId,
  ssr: true
})

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia],
  projectId,
  metadata,
  features: {
    analytics: true
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
