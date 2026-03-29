import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    getEndpoints, createEndpoint, deleteEndpoint,
    getRateLimit, createRateLimit, updateRateLimit, getWebsites
} from '../services/api'

// ── Rate Limit Modal ──────────────────────────────────────────────────────────
function RateLimitModal({ endpoint, onClose, onSaved }) {
    const [form, setForm] = useState({ capacity: 100, refillRate: 10, windowSeconds: 60 })
    const [existingRuleId, setExistingRuleId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getRateLimit(endpoint.id)
            .then((res) => {
                setForm({
                    capacity: res.data.capacity,
                    refillRate: res.data.refillRate,
                    windowSeconds: res.data.windowSeconds,
                })
                setExistingRuleId(res.data.id)
            })
            .catch(() => { /* no existing rule */ })
    }, [endpoint.id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const payload = {
                capacity: parseInt(form.capacity),
                refillRate: parseInt(form.refillRate),
                windowSeconds: parseInt(form.windowSeconds),
            }
            let saved
            if (existingRuleId) {
                saved = await updateRateLimit(existingRuleId, payload)
            } else {
                saved = await createRateLimit(endpoint.id, payload)
                setExistingRuleId(saved.data.id)
            }
            onSaved(endpoint.id, saved.data)
            onClose()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save rate limit')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass w-full max-w-md p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-primary-600/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Rate Limit Config</h2>
                        <p className="text-sm text-white/40">{endpoint.method} {endpoint.path}</p>
                    </div>
                </div>

                <form id={`form-ratelimit-${endpoint.id}`} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Capacity (tokens)</label>
                            <input type="number" min="1" className="input" value={form.capacity}
                                onChange={e => setForm({ ...form, capacity: e.target.value })} required />
                        </div>
                        <div>
                            <label className="label">Refill Rate (tokens/s)</label>
                            <input type="number" min="1" className="input" value={form.refillRate}
                                onChange={e => setForm({ ...form, refillRate: e.target.value })} required />
                        </div>
                    </div>
                    <div>
                        <label className="label">Window (seconds)</label>
                        <input type="number" min="1" className="input" value={form.windowSeconds}
                            onChange={e => setForm({ ...form, windowSeconds: e.target.value })} required />
                    </div>

                    <div className="p-3 bg-surface-700 rounded-xl border border-white/5 text-sm text-white/50">
                        <span className="text-accent font-medium">{form.capacity} req</span> max burst,{' '}
                        refilling at <span className="text-accent font-medium">{form.refillRate} req/s</span>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
                        <button id={`btn-save-ratelimit-${endpoint.id}`} type="submit" className="btn-primary flex-1" disabled={loading}>
                            {loading ? 'Saving…' : (existingRuleId ? 'Update' : 'Apply')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Add Endpoint Modal ────────────────────────────────────────────────────────
function AddEndpointModal({ websiteId, onClose, onAdded }) {
    const [form, setForm] = useState({ path: '', method: 'GET' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await createEndpoint(websiteId, form)
            onAdded(res.data)
            onClose()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add endpoint')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass w-full max-w-md p-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-5">Add Endpoint</h2>
                <form id="form-add-endpoint" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Path</label>
                        <input className="input" placeholder="/api/login" value={form.path}
                            onChange={(e) => setForm({ ...form, path: e.target.value })} required />
                    </div>
                    <div>
                        <label className="label">HTTP Method</label>
                        <select className="input" value={form.method}
                            onChange={(e) => setForm({ ...form, method: e.target.value })}>
                            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
                        <button id="btn-add-endpoint-submit" type="submit" className="btn-primary flex-1" disabled={loading}>
                            {loading ? 'Adding…' : 'Add Endpoint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Traffic Simulator Modal ───────────────────────────────────────────────────
function TrafficSimulatorModal({ endpoint, website, onClose }) {
    const [count, setCount] = useState(50)
    const [speed, setSpeed] = useState(10) // ms
    const [results, setResults] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    const runSimulation = async () => {
        setIsRunning(true)
        setResults([])
        const targetUrl = `/gateway/${website.apiKey}${endpoint.path}`
        
        for(let i=0; i<count; i++) {
            await new Promise(r => setTimeout(r, speed))
            fetch(targetUrl)
              .then(res => {
                  setResults(prev => {
                      const updated = [...prev, { id: i, status: res.status }];
                      return updated.sort((a, b) => a.id - b.id);
                  })
              })
              .catch(err => {
                  setResults(prev => {
                      const updated = [...prev, { id: i, status: 'ERR' }];
                      return updated.sort((a, b) => a.id - b.id);
                  })
              })
        }
        setIsRunning(false)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass w-full max-w-2xl p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Traffic Simulator</h2>
                        <p className="text-sm text-white/40">Target: {website.domain}{endpoint.path}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="label">Number of Requests</label>
                        <input type="range" min="10" max="200" value={count} disabled={isRunning}
                            onChange={e => setCount(parseInt(e.target.value))} className="w-full accent-purple-500" />
                        <div className="text-right text-xs text-white/50">{count} requests</div>
                    </div>
                    <div>
                        <label className="label">Delay (ms)</label>
                        <input type="range" min="0" max="1000" value={speed} disabled={isRunning}
                            onChange={e => setSpeed(parseInt(e.target.value))} className="w-full accent-purple-500" />
                        <div className="text-right text-xs text-white/50">{speed} ms</div>
                    </div>
                </div>

                <div className="flex gap-3 mb-6">
                    <button type="button" className="btn-secondary flex-1" onClick={onClose} disabled={isRunning}>Close</button>
                    <button onClick={runSimulation} className="btn-primary flex-1 !bg-purple-600 hover:!bg-purple-500" disabled={isRunning}>
                        {isRunning ? 'Firing...' : 'Fire Requests ⚡️'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-surface-700/50 rounded-xl p-4 border border-white/5 min-h-[120px]">
                    <div className="flex flex-wrap gap-1">
                        {results.map((res, i) => (
                            <div key={i} className={`w-3 h-3 rounded-sm ${res.status === 200 ? 'bg-green-500' : res.status === 429 ? 'bg-red-500' : 'bg-orange-500'} transition-all`} title={`Status: ${res.status}`}></div>
                        ))}
                        {isRunning && Array.from({length: count - results.length}).map((_, i) => (
                            <div key={`empty-${i}`} className="w-3 h-3 rounded-sm bg-white/10 animate-pulse"></div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-4 flex gap-4 text-sm justify-center">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> <span className="text-white/70">Allowed (200)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> <span className="text-white/70">Blocked (429)</span></div>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const METHOD_COLORS = {
    GET: 'text-green-400 bg-green-400/10 border-green-400/20',
    POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    PUT: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    PATCH: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function ManageEndpointsPage() {
    const { websiteId } = useParams()
    const navigate = useNavigate()
    const [endpoints, setEndpoints] = useState([])
    const [rateLimits, setRateLimits] = useState({}) // endpointId → rule
    const [website, setWebsite] = useState(null)
    const [simulating, setSimulating] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [configuring, setConfiguring] = useState(null) // endpoint obj

    useEffect(() => {
        getWebsites().then(res => setWebsite(res.data.find(w => w.id === websiteId))).catch(console.error)
        getEndpoints(websiteId)
            .then(async (res) => {
                setEndpoints(res.data)
                // load rate limits for all endpoints
                const rlMap = {}
                await Promise.all(
                    res.data.map((ep) =>
                        getRateLimit(ep.id)
                            .then((r) => { rlMap[ep.id] = r.data })
                            .catch(() => { })
                    )
                )
                setRateLimits(rlMap)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [websiteId])

    const handleDelete = async (id) => {
        if (!confirm('Delete this endpoint?')) return
        await deleteEndpoint(id)
        setEndpoints((prev) => prev.filter((e) => e.id !== id))
        setRateLimits((prev) => { const n = { ...prev }; delete n[id]; return n })
    }

    const handleRateLimitSaved = (endpointId, rule) => {
        setRateLimits((prev) => ({ ...prev, [endpointId]: rule }))
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/')}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Endpoints</h1>
                    <p className="text-white/40 text-sm">{endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured</p>
                </div>
                <button id="btn-add-endpoint" onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 ml-auto">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Endpoint
                </button>
            </div>

            {/* Table */}
            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="table-header text-left">Method</th>
                                <th className="table-header text-left">Path</th>
                                <th className="table-header text-left">Rate Limit</th>
                                <th className="table-header text-left">Refill Rate</th>
                                <th className="table-header text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-white/30">Loading…</td></tr>
                            ) : endpoints.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-white/30">
                                    No endpoints yet. Add one to start protecting your API.
                                </td></tr>
                            ) : (
                                endpoints.map((ep) => {
                                    const rl = rateLimits[ep.id]
                                    const methodColor = METHOD_COLORS[ep.method] || 'text-white/60 bg-white/10 border-white/10'
                                    return (
                                        <tr key={ep.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="table-cell">
                                                <span className={`badge border font-mono ${methodColor}`}>{ep.method}</span>
                                            </td>
                                            <td className="table-cell font-mono text-white/90">{ep.path}</td>
                                            <td className="table-cell">
                                                {rl ? (
                                                    <span className="text-accent font-medium">{rl.capacity} req</span>
                                                ) : (
                                                    <span className="text-white/30 text-xs italic">not set</span>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                {rl ? (
                                                    <span className="text-primary-400">{rl.refillRate}/s</span>
                                                ) : (
                                                    <span className="text-white/30 text-xs italic">—</span>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSimulating(ep)}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 
                                       text-emerald-400 border border-emerald-600/30 transition-all flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                        Simulate
                                                    </button>
                                                    <button
                                                        id={`btn-config-ratelimit-${ep.id}`}
                                                        onClick={() => setConfiguring(ep)}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/40 
                                       text-primary-400 border border-primary-600/30 transition-all">
                                                        {rl ? 'Edit Limit' : 'Set Limit'}
                                                    </button>
                                                    <button id={`btn-delete-endpoint-${ep.id}`} onClick={() => handleDelete(ep.id)}
                                                        className="btn-danger">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showAdd && (
                <AddEndpointModal
                    websiteId={websiteId}
                    onClose={() => setShowAdd(false)}
                    onAdded={(ep) => setEndpoints((prev) => [...prev, ep])}
                />
            )}
            {configuring && (
                <RateLimitModal
                    endpoint={configuring}
                    onClose={() => setConfiguring(null)}
                    onSaved={handleRateLimitSaved}
                />
            )}
            {simulating && website && (
                <TrafficSimulatorModal
                    endpoint={simulating}
                    website={website}
                    onClose={() => setSimulating(null)}
                />
            )}
        </div>
    )
}
