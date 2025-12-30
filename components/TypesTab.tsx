
import React, { useState } from 'react';

const TypesTab: React.FC = () => {
  const [mode, setMode] = useState<'L4' | 'L7'>('L4');
  const [inspecting, setInspecting] = useState(false);
  const [activePath, setActivePath] = useState('/');

  const getPacketData = () => {
    if (mode === 'L4') {
      return {
        protocol: 'TCP',
        srcIp: '203.0.113.1',
        destIp: '10.0.0.5',
        port: '443',
        payload: 'ENCRYPTED_STREAM (Binary Data)'
      };
    }
    return {
      protocol: 'HTTP/2',
      method: 'GET',
      path: activePath,
      host: 'api.myapp.com',
      auth: 'Bearer eyJhbGci...'
    };
  };

  const data = getPacketData();

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">L4 vs L7: How deep do we look?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Load balancers operate at different layers of the OSI model. 
          Choosing between them depends on whether you need speed or intelligence.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-800 rounded-xl border border-slate-700">
           <button 
             onClick={() => { setMode('L4'); setInspecting(false); }}
             className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'L4' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
           >Layer 4 (Transport)</button>
           <button 
             onClick={() => { setMode('L7'); setInspecting(false); }}
             className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'L7' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
           >Layer 7 (Application)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Interactive Packet View */}
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Packet Inspector
            <span className={`text-[10px] px-2 py-0.5 rounded ${mode === 'L4' ? 'bg-blue-500' : 'bg-indigo-500'}`}>
              {mode === 'L4' ? 'TCP/UDP' : 'HTTP/S'}
            </span>
          </h3>

          <div className="relative h-64 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-8">
            {inspecting ? (
              <div className="w-full h-full animate-in fade-in zoom-in duration-300">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-mono text-slate-500">PACKET_HEADER_DUMP</p>
                    <button onClick={() => setInspecting(false)} className="text-xs text-blue-400 hover:underline">Close</button>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                    {Object.entries(data).map(([k, v]) => (
                      <div key={k} className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block uppercase text-[9px] mb-1">{k}</span>
                        <span className="text-white truncate block">{v}</span>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="text-center group cursor-pointer" onClick={() => setInspecting(true)}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                <p className="text-sm font-bold text-slate-400 group-hover:text-blue-400 transition-colors">Click to Open Packet</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Incoming Data Block</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Routing Decision</h4>
            {mode === 'L4' ? (
              <div className="p-4 bg-blue-900/10 border border-blue-800/50 rounded-xl">
                <p className="text-sm text-blue-300 font-medium">"I only see IP <span className="font-mono text-white">203.0.113.1</span> and Port <span className="font-mono text-white">443</span>. I will route this connection blindly to Server A."</p>
              </div>
            ) : (
              <div className="space-y-3">
                 <p className="text-sm text-indigo-300 font-medium italic">"Ah, I see an HTTP request for {activePath}..."</p>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setActivePath('/images')}
                      className={`flex-1 p-2 rounded text-[10px] font-bold border ${activePath === '/images' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}
                    >GET /images</button>
                    <button 
                      onClick={() => setActivePath('/video')}
                      className={`flex-1 p-2 rounded text-[10px] font-bold border ${activePath === '/video' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}
                    >GET /video</button>
                 </div>
                 <div className="p-4 bg-indigo-900/10 border border-indigo-800/50 rounded-xl">
                   <p className="text-sm text-indigo-300">
                     {activePath === '/images' ? 'Routing to Image-Optimization-Cluster' : 'Routing to High-Throughput-Video-Cluster'}
                   </p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Feature Comparison */}
        <div className="space-y-6">
           <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <span className="text-2xl">{mode === 'L4' ? '⚡' : '🧠'}</span>
                {mode === 'L4' ? 'Performance Focused' : 'Intelligence Focused'}
              </h3>
              
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-slate-900 rounded-full flex items-center justify-center text-sm">✓</div>
                    <div>
                      <h4 className="font-bold text-sm">{mode === 'L4' ? 'Ultra Low Latency' : 'Content-Based Routing'}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {mode === 'L4' 
                          ? 'Doesn’t decrypt or inspect payload. Fast processing, ideal for high-volume raw traffic.' 
                          : 'Can route based on URL path, cookie values, or HTTP headers. Highly flexible.'}
                      </p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-slate-900 rounded-full flex items-center justify-center text-sm">✓</div>
                    <div>
                      <h4 className="font-bold text-sm">{mode === 'L4' ? 'Static Protocols' : 'Modern Web Features'}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {mode === 'L4'
                          ? 'Best for DB traffic (MySQL, Postgres) and non-HTTP protocols.'
                          : 'Supports TLS termination, session persistence, and web application firewalls (WAF).'}
                      </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Real World Example</h4>
             <p className="text-sm leading-relaxed">
                {mode === 'L4' 
                  ? 'Cloud providers often use L4 for their "Network Load Balancers" (e.g. AWS NLB). It provides a static IP and handles millions of requests per second with negligible delay.'
                  : 'Nginx, HAProxy, and AWS "Application Load Balancer" (ALB) are classic L7 examples. They act as "Reverse Proxies" and can even serve static images directly without hitting a backend.'}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TypesTab;
