
import React, { useState, useEffect } from 'react';

const IntroTab: React.FC = () => {
  const [requestsPerSec, setRequestsPerSec] = useState(10);
  const [isLBActive, setIsLBActive] = useState(false);
  const [showChaos, setShowChaos] = useState(true);

  const getHealthColor = (rps: number, split: boolean) => {
    const load = split ? rps / 3 : rps;
    if (load > 70) return 'bg-red-500';
    if (load > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isServerStressed = !isLBActive && requestsPerSec > 50;

  // Auto-switch to showing chaos if stress is high and LB is off
  useEffect(() => {
    if (isServerStressed) setShowChaos(true);
  }, [isServerStressed]);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">What is a Load Balancer?</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Think of a Load Balancer as a <span className="text-blue-400 font-semibold underline decoration-blue-500/30 underline-offset-4">traffic cop</span> standing in front of your servers. 
          Its job is to route incoming client requests to all servers capable of fulfilling those requests efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Scenario Display */}
        <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 flex flex-col min-h-[500px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${isLBActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isLBActive ? 'bg-green-400 animate-pulse' : 'bg-red-400 shake'}`} />
                {isLBActive ? 'Distributed' : 'Direct Traffic'}
             </span>
          </div>

          <h3 className="text-xl font-bold mb-12 flex items-center gap-2 text-slate-200">
            {isLBActive ? '✨ The Orderly System' : '🔥 The Chaotic Scene'}
          </h3>

          <div className="flex-1 flex items-center justify-between relative">
            {/* Clients */}
            <div className="z-10 flex flex-col items-center gap-4">
               <div className="relative">
                  <span className="text-5xl drop-shadow-2xl">💻</span>
                  {/* Flowing Packets */}
                  {Array.from({ length: Math.min(10, Math.ceil(requestsPerSec / 10)) }).map((_, i) => (
                    <div 
                      key={i}
                      className="packet-flow absolute"
                      style={{
                        top: '50%',
                        left: '100%',
                        animation: `packet-path ${20 / requestsPerSec}s infinite linear`,
                        animationDelay: `${i * (2 / Math.ceil(requestsPerSec / 10))}s`
                      }}
                    />
                  ))}
               </div>
               <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Traffic Source</p>
            </div>

            {/* Load Balancer (Conditional) */}
            <div className="flex-1 flex justify-center px-4">
              {isLBActive ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-blue-600 p-5 rounded-2xl shadow-2xl border-4 border-slate-900 z-10 transition-transform hover:scale-110">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <p className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-500 uppercase tracking-widest whitespace-nowrap">Load Balancer</p>
                </div>
              ) : (
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent relative opacity-30" />
              )}
            </div>

            {/* Backend Servers */}
            <div className="flex flex-col gap-6">
              {!isLBActive ? (
                <div className={`text-center transition-all ${isServerStressed ? 'shake' : ''}`}>
                   <div className={`w-20 h-24 ${getHealthColor(requestsPerSec, false)} rounded-2xl flex flex-col items-center justify-center border-4 border-slate-900 shadow-2xl relative overflow-hidden group`}>
                    <span className="text-3xl z-10">🖥️</span>
                    {isServerStressed && (
                      <div className="absolute inset-0 bg-red-600 animate-pulse opacity-40" />
                    )}
                  </div>
                  <p className="text-[10px] font-black mt-3 text-slate-400 uppercase tracking-widest">Main Server</p>
                  <div className="mt-1 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getHealthColor(requestsPerSec, false)}`} style={{ width: `${Math.min(requestsPerSec, 100)}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-14 h-16 ${getHealthColor(requestsPerSec, true)} rounded-xl flex items-center justify-center border-2 border-slate-900 shadow-lg relative`}>
                        <span className="text-xl">🖥️</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-sm" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-slate-400">SRV-0{i}</p>
                        <p className="text-[9px] text-green-400 font-mono">{(requestsPerSec / 3).toFixed(1)} req/s</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 h-full flex flex-col justify-center">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h4 className="font-bold text-xl text-slate-200">The Stress Test</h4>
                <p className="text-sm text-slate-500">Scale the traffic to see the breaking point.</p>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black ${isServerStressed ? 'text-red-500' : 'text-blue-400'}`}>
                  {requestsPerSec}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-bold">RPS</span>
              </div>
            </div>

            <div className="mb-10">
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={requestsPerSec} 
                onChange={(e) => setRequestsPerSec(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-950 rounded-xl appearance-none cursor-pointer accent-blue-500 transition-all hover:brightness-125"
              />
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Idle</span>
                <span>Optimized</span>
                <span className={requestsPerSec > 60 ? 'text-red-500 animate-pulse' : ''}>Danger Zone</span>
              </div>
            </div>

            <div className="space-y-4">
              {isServerStressed && !isLBActive ? (
                <div className="p-6 bg-red-500/10 border-2 border-dashed border-red-500/50 rounded-2xl text-center">
                  <p className="text-red-400 text-sm font-bold mb-4">⚠️ SYSTEM CAPACITY EXCEEDED</p>
                  <button 
                    onClick={() => setIsLBActive(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-black text-sm transition-all shadow-xl shadow-blue-900/40 transform active:scale-95 uppercase tracking-widest"
                  >
                    Deploy Load Balancer
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <p className="text-xs text-slate-400">
                      {isLBActive 
                        ? "Traffic is evenly distributed. All servers are operating in the healthy green zone." 
                        : "Traffic is hitting a single server. Watch the health bar as you increase requests."}
                    </p>
                  </div>
                  {isLBActive && (
                    <button 
                      onClick={() => setIsLBActive(false)}
                      className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-400 px-6 py-3 rounded-xl font-bold text-xs border border-slate-600 transition-all uppercase tracking-widest"
                    >
                      Disable Load Balancer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Status', val: isServerStressed ? 'CRITICAL' : 'STABLE', color: isServerStressed ? 'text-red-500' : 'text-green-500' },
          { label: 'Latency', val: isLBActive ? '12ms' : requestsPerSec > 50 ? '450ms' : '22ms', color: 'text-blue-400' },
          { label: 'Resource Use', val: isLBActive ? `${Math.round(requestsPerSec/3)}%` : `${requestsPerSec}%`, color: 'text-purple-400' },
          { label: 'Uptime', val: isServerStressed ? 'DROPPING' : '99.99%', color: isServerStressed ? 'text-red-400' : 'text-slate-200' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">{stat.label}</p>
            <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroTab;
