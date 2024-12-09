import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import './App.css'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Deployed contract address on Base Sepolia
const CONTRACT_ADDRESS = '0xb38572793FDF5e23A124BfD05D3a9E1C7c6772b7'
const MESSAGE_COST = '0.001'

// ABI for the payForMessage function
const abi = [{
  name: 'payForMessage',
  type: 'function',
  stateMutability: 'payable',
  inputs: [],
  outputs: [],
}] as const

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { address, isConnected } = useAccount()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputMessage.trim() || !isConnected) return

    setError('')
    setIsLoading(true)

    try {
      // First initiate the payment transaction
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'payForMessage',
        value: parseEther(MESSAGE_COST),
      })

      // Wait for transaction confirmation before sending message
      if (isConfirmed) {
        // Add user message
        const userMessage: Message = { role: 'user', content: inputMessage }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)

        // Send message to backend
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        })

        const data: { response: string } = await response.json()
        
        // Add AI response
        const assistantMessage: Message = { role: 'assistant', content: data.response }
        setMessages([...newMessages, assistantMessage])
        setInputMessage('')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to process payment or send message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="wallet-connect">
        <appkit-button />
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              Hello! Connect your wallet and pay {MESSAGE_COST} ETH per message to chat.
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                {isConfirming ? 'Confirming payment...' : 'Thinking...'}
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message here..." : "Connect wallet to chat"}
            disabled={isLoading || !isConnected}
          />
          <button 
            type="submit" 
            disabled={isLoading || !isConnected || !inputMessage.trim()}
          >
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
