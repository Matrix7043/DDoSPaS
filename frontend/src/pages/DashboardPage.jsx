import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWebsites, createWebsite, deleteWebsite } from '../services/api'

function AddWebsiteModal({ onClose, onAdded }) {
    const [form, setForm] = useState({ domain: '', targetOrigin: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await createWebsite(form)
            onAdded(res.data)
            onClose()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add website')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass w-full max-w-md p-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-5">Add Protected Website</h2>
                <form id="form-add-website" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Domain</label>
                        <input className="input" placeholder="example.com" value={form.domain}
                            onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
                    </div>
                    <div>
                        <label className="label">Target Origin (your actual server)</label>
                        <input className="input" placeholder="http://your-server.com" value={form.targetOrigin}
                            onChange={(e) => setForm({ ...form, targetOrigin: e.target.value })} required />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
                        <button id="btn-add-website-submit" type="submit" className="btn-primary flex-1" disabled={loading}>
                            {loading ? 'Adding…' : 'Add Website'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function WebsiteCard({ website, onDelete, onManage }) {
    const [copied, setCopied] = useState(false)

    const copyGateway = () => {
        navigator.clipboard.writeText(website.gatewayUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="card hover:border-primary-600/40 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"></div>
                        <h3 className="text-lg font-semibold text-white">{website.domain}</h3>
                    </div>
                    <p className="text-sm text-white/40 truncate max-w-xs">{website.targetOrigin}</p>
                </div>
                <div className="flex gap-2">
                    <button id={`btn-manage-${website.id}`} onClick={() => onManage(website.id)}
                        className="btn-secondary text-sm py-1.5 px-3">
                        Manage
                    </button>
                    <button id={`btn-delete-website-${website.id}`} onClick={() => onDelete(website.id)}
                        className="btn-danger">
                        Delete
                    </button>
                </div>
            </div>

            <div className="mt-3 p-3 bg-surface-700 rounded-xl border border-white/5">
                <p className="text-xs text-white/40 mb-1 font-medium uppercase tracking-wider">Gateway URL</p>
                <div className="flex items-center gap-2">
                    <code className="text-xs text-accent flex-1 truncate">{website.gatewayUrl}/**</code>
                    <button onClick={copyGateway}
                        className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <span className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30">
                    apiKey: {website.apiKey.slice(0, 8)}…
                </span>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const [websites, setWebsites] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getWebsites()
            .then((res) => setWebsites(res.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Delete this website and all its endpoints?')) return
        await deleteWebsite(id)
        setWebsites((prev) => prev.filter((w) => w.id !== id))
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Websites</h1>
                    <p className="text-white/40 text-sm mt-1">
                        {websites.length} protected propert{websites.length === 1 ? 'y' : 'ies'}
                    </p>
                </div>
                <button id="btn-add-website" onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Website
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Protected Sites', value: websites.length, color: 'text-primary-400' },
                    { label: 'Status', value: 'Active', color: 'text-green-400' },
                    { label: 'Gateway', value: 'Online', color: 'text-accent' },
                ].map((stat) => (
                    <div key={stat.label} className="card text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Websites */}
            {loading ? (
                <div className="text-center py-20 text-white/40">Loading…</div>
            ) : websites.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                        </svg>
                    </div>
                    <p className="text-white/50 text-lg font-medium">No websites yet</p>
                    <p className="text-white/30 text-sm mt-1">Add your first website to get started</p>
                    <button onClick={() => setShowAdd(true)} className="btn-primary mt-4">Add Website</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {websites.map((w) => (
                        <WebsiteCard
                            key={w.id}
                            website={w}
                            onDelete={handleDelete}
                            onManage={(id) => navigate(`/websites/${id}/endpoints`)}
                        />
                    ))}
                </div>
            )}

            {showAdd && (
                <AddWebsiteModal
                    onClose={() => setShowAdd(false)}
                    onAdded={(w) => setWebsites((prev) => [...prev, w])}
                />
            )}
        </div>
    )
}
