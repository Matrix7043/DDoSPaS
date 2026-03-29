import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import useAuthStore from '../store/useAuthStore'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const setAuth = useAuthStore((s) => s.setAuth)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await login(form)
            setAuth(res.data.token, { email: res.data.email, userId: res.data.userId })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="fixed inset-0 glow-purple pointer-events-none" />

            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent rounded-2xl mb-4 shadow-lg shadow-primary-600/30">
                        <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                    <p className="text-white/50 mt-2 text-sm">Sign in to your DPaaS account</p>
                </div>

                <div className="card">
                    <form id="form-login" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label" htmlFor="email">Email address</label>
                            <input id="email" type="email" className="input" placeholder="you@example.com"
                                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div>
                            <label className="label" htmlFor="password">Password</label>
                            <input id="password" type="password" className="input" placeholder="••••••••"
                                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <button id="btn-login-submit" type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/40 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
