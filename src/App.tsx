import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Home from '@pages/Home'
import Auth from '@pages/Auth'
import Intake from '@pages/Intake'
import Dashboard from '@pages/Dashboard'
import Report from '@pages/Report'
import AuthGuard from '@components/AuthGuard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/intake"
              element={
                <AuthGuard>
                  <Intake />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/report/:projectId"
              element={
                <AuthGuard>
                  <Report />
                </AuthGuard>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

