import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import ManageEndpointsPage from './pages/ManageEndpointsPage'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
    const token = useAuthStore((s) => s.token)
    return token ? children : <Navigate to="/login" replace />
}

function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-surface-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}

export default function App() {
    const token = useAuthStore((s) => s.token)

    return (
        <Routes>
            <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

            <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <AppLayout>
                        <DashboardPage />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/websites/:websiteId/endpoints" element={
                <ProtectedRoute>
                    <AppLayout>
                        <ManageEndpointsPage />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
