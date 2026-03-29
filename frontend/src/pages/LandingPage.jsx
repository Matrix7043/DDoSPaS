import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen bg-surface-900 overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-float-slow"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">DPaaS</span>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="text-white/70 hover:text-white font-medium transition-colors">Login</button>
                    <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
                </div>
            </nav>

            <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-xs font-semibold text-accent uppercase tracking-widest">Enterprise Grade Security</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-slide-up">
                    <span className="block">Unstoppable</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent">Infrastructure.</span>
                </h1>
                
                <p className="max-w-2xl text-xl text-white/50 mb-12 leading-relaxed animate-slide-up bg-surface-900/50 backdrop-blur-sm p-2 rounded-lg" style={{ animationDelay: '0.1s' }}>
                    Shield your backend from volumetric attacks with our distributed edge protection. 
                    Real-time rate limiting, AI detection, and instant deployment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button onClick={() => navigate('/register')} className="group relative btn-primary py-4 px-10 text-lg flex items-center gap-3 overflow-hidden">
                        <span className="relative z-10">Protect your Site Now</span>
                        <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                    <button onClick={() => navigate('/login')} className="btn-secondary py-4 px-10 text-lg">
                        View Dashboard
                    </button>
                </div>

                {/* Grid Visual */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    {[
                        { title: 'Edge Protection', desc: 'Lua-powered token bucket at the OpenResty layer.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                        { title: 'AI Detection', desc: 'Unsupervised learning to catch zero-day anomalies.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { title: 'Zero Config', desc: 'Deploy protection in minutes with our intuitive panel.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' }
                    ].map((feature, i) => (
                        <div key={i} className="glass p-8 text-left group hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500/10 transition-colors">
                                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 text-center">
                <p className="text-white/20 text-sm">© 2026 DPaaS Security Operations. All rights reserved.</p>
            </footer>
        </div>
    )
}
