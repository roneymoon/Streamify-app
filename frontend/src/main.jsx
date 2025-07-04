import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "stream-chat-react/dist/css/v2/index.css"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// tanstack react query
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { ChatWidgetProvider } from './contexts/ChatWidgetContext.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChatWidgetProvider>
          <App />
        </ChatWidgetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
