import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketContext } from './context/socketcontext';
import socket from './socket';

socket.connect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </StrictMode>,
)
