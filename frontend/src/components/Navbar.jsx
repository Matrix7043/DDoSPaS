import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="border-b border-white/10 bg-surface-800/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-white">DPaaS</span>
                        <span className="hidden sm:block text-xs text-white/40 font-medium mt-0.5">
                            DDoS Protection as a Service
                        </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"></span>
                            <span className="text-sm text-white/60 hidden sm:block">{user?.email}</span>
                        </div>
                        <button id="btn-logout" onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
