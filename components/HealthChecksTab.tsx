
import React, { useState, useEffect } from 'react';

const HealthChecksTab: React.FC = () => {
  const [servers, setServers] = useState([
    { id: 1, active: true, heartbeats: 0 },
    { id: 2, active: true, heartbeats: 0 },
    { id: 3, active: true, heartbeats: 0 }
  ]);
  const [packets, setPackets] = useState<{ id: number; target: number }[]>([]);

  // Simulation of incoming traffic
  useEffect(() => {
    const interval = setInterval(() => {
      const healthyServers = servers.filter(s => s.active);
      if (healthyServers.length === 0) return;
      
      const randomTarget = healthyServers[Math.floor(Math.random() * healthyServers.length)].id;
      const newPacket = { id: Date.now(), target: randomTarget };
      
      setPackets(prev => [...prev.slice(-12), newPacket]);
      
      // Update heartbeat count for healthy servers
      setServers(prev => prev.map(s => s.active ? { ...s, heartbeats: s.heartbeats + 1 } : s));
    }, 1000);

    return () => clearInterval(interval);
  }, [servers]);

  const toggleServer = (id: number) => {
    setServers(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-white">Fault Tolerance</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          The Load Balancer uses <span className="text-pink-400 font-bold">Health Checks</span> to monitor backends. 
          If a server fails a health check, it's immediately removed from the active rotation.
        </p>
      </div>

      <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 relative min-h-[500px] overflow-hidden shadow-inner">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <div className="relative z-10 flex h-full items-center justify-between gap-4">
          {/* Load Balancer */}
          <div className="text-center w-32">
            <div className="bg-blue-600 w-24 h-24 mx-auto rounded-full shadow-[0_0_50px_rgba(37,99,235,0.3)] border-8 border-slate-900 mb-4 flex items-center justify-center relative group">
              <span className="text-4xl z-10 transition-transform group-hover:scale-110">⚖️</span>
              <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Controller</p>
            <div className="mt-2 bg-slate-900 border border-slate-800 rounded px-2 py-1 inline-block">
               <span className="text-[9px] font-mono text-green-400 animate-pulse">SYSTEM_ACTIVE</span>
            </div>
          </div>

          {/* Network Fabric */}
          <div className="flex-1 h-[400px] relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {servers.map(s => {
                const yPos = s.id === 1 ? '15%' : s.id === 2 ? '50%' : '85%';
                return (
                  <g key={s.id}>
                    <path 
                      d={`M 0 50% L 100% ${yPos}`}
                      className={`transition-all duration-1000 ${s.active ? 'stroke-blue-500/20' : 'stroke-red-500/10'}`}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={s.active ? "none" : "5,5"}
                    />
                    {/* Heartbeat pulse path */}
                    {s.active && (
                       <circle r="3" fill="#f472b6" className="animate-[heartbeat-flow_3s_infinite_linear]">
                         <animateMotion path={`M 0 50% L 100% ${yPos}`} dur="3s" repeatCount="indefinite" />
                       </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Data Packets */}
            {packets.map((p) => {
              const targetServer = servers.find(s => s.id === p.target);
              if (!targetServer || !targetServer.active) return null;
              
              return (
                <div 
                  key={p.id}
                  className="absolute left-0 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] z-20"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    animation: `packet-path-${p.target} 1.2s forwards linear`
                  }}
                />
              );
            })}
          </div>

          {/* Servers Pool */}
          <div className="flex flex-col gap-8">
            {servers.map(s => (
              <div 
                key={s.id}
                className={`w-60 p-6 rounded-3xl border-2 transition-all duration-700 flex flex-col items-center group relative ${
                  s.active 
                    ? 'bg-slate-900 border-slate-800 shadow-xl' 
                    : 'bg-red-950/10 border-red-900/40 grayscale'
                }`}
              >
                <div className="flex justify-between w-full items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-600 shadow-[0_0_8px_#dc2626]'}`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SRV-0{s.id}</span>
                  </div>
                  {s.active && (
                    <div className="text-[9px] font-mono text-pink-400 flex items-center gap-1">
                      <span className="animate-ping">💓</span> {s.heartbeats}
                    </div>
                  )}
                </div>
                
                <div className={`text-5xl mb-6 transition-transform group-hover:scale-110 duration-500 ${!s.active ? 'opacity-30' : ''}`}>
                   {s.active ? '🖥️' : '🚫'}
                </div>
                
                <button 
                  onClick={() => toggleServer(s.id)}
                  className={`w-full py-3 rounded-xl text-xs font-black transition-all transform active:scale-95 uppercase tracking-tighter ${
                    s.active 
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20' 
                      : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/30'
                  }`}
                >
                  {s.active ? 'Simulate Crash' : 'Restart Server'}
                </button>

                {!s.active && (
                   <div className="absolute inset-0 bg-red-950/5 rounded-3xl pointer-events-none flex items-center justify-center">
                      <div className="bg-red-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Offline</div>
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
           <h4 className="font-bold text-sm mb-2 text-pink-400 flex items-center gap-2">
             <span className="group-hover:scale-125 transition-transform">💓</span> Heartbeat Mechanism
           </h4>
           <p className="text-xs text-slate-400 leading-relaxed">The Load Balancer sends periodic requests (Pings) to a specific endpoint. If the server doesn't respond with a 200 OK within a timeout, it's unhealthy.</p>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
           <h4 className="font-bold text-sm mb-2 text-blue-400 flex items-center gap-2">
             <span className="group-hover:scale-125 transition-transform">🔄</span> Automatic Failover
           </h4>
           <p className="text-xs text-slate-400 leading-relaxed">Once detected as down, traffic is automatically rerouted to remaining healthy nodes. This prevents the user from ever seeing a "Connection Refused" error.</p>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
           <h4 className="font-bold text-sm mb-2 text-green-400 flex items-center gap-2">
             <span className="group-hover:scale-125 transition-transform">🩹</span> Self-Healing
           </h4>
           <p className="text-xs text-slate-400 leading-relaxed">When the crashed server is revived, the Load Balancer continues to check it. After a configured number of successful checks, it's added back to the pool.</p>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat-flow {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes packet-path-1 {
          0% { left: 0%; top: 50%; opacity: 1; }
          100% { left: 100%; top: 15%; opacity: 0; }
        }
        @keyframes packet-path-2 {
          0% { left: 0%; top: 50%; opacity: 1; }
          100% { left: 100%; top: 50%; opacity: 0; }
        }
        @keyframes packet-path-3 {
          0% { left: 0%; top: 50%; opacity: 1; }
          100% { left: 100%; top: 85%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HealthChecksTab;
