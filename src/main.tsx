import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ScrollManager from './components/scrollManager.tsx'
import WebSolutionPricing from './components/webSolutionPricing.tsx'
import AiCreation from './components/aiCreation.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/web-solutions" element={<WebSolutionPricing />} />
        <Route path="/ai-creation" element={<AiCreation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
