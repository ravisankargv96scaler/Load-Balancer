
import React, { useState, useCallback } from 'react';

type Algo = 'RR' | 'WRR' | 'LC' | 'IPH';

interface HistoryEntry {
  id: number;
  server: string;
  ip: string;
}

const AlgorithmsTab: React.FC = () => {
  const [algo, setAlgo] = useState<Algo>('RR');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [rrCounter, setRrCounter] = useState(0);
  const [clientIp, setClientIp] = useState('192.168.1.42');
  
  const [servers] = useState([
    { id: 'A', weight: 5, conns: 2 },
    { id: 'B', weight: 1, conns: 8 },
    { id: 'C', weight: 1, conns: 12 },
  ]);

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const processRequest = useCallback(() => {
    let selectedServer = 'A';

    switch (algo) {
      case 'RR':
        selectedServer = servers[rrCounter % servers.length].id;
        setRrCounter(prev => prev + 1);
        break;
      case 'WRR':
        // Simplified Weighted RR: A has weight 5, others 1. Total 7.
        const totalWeight = servers.reduce((acc, s) => acc + s.weight, 0);
        const roll = Math.floor(Math.random() * totalWeight);
        let cumulative = 0;
        for (const s of servers) {
          cumulative += s.weight;
          if (roll < cumulative) {
            selectedServer = s.id;
            break;
          }
        }
        break;
      case 'LC':
        // Pick server with minimum simulated connections
        selectedServer = [...servers].sort((a, b) => a.conns - b.conns)[0].id;
        break;
      case 'IPH':
        selectedServer = servers[hashString(clientIp) % servers.length].id;
        break;
    }

    const newEntry = {
      id: Date.now(),
      server: selectedServer,
      ip: clientIp
    };

    setHistory(prev => [newEntry, ...prev].slice(0, 10));
  }, [algo, rrCounter, clientIp, servers]);

  const algoInfo = {
    RR: { name: 'Round Robin', desc: 'Distributes requests sequentially across the list of servers.' },
    WRR: { name: 'Weighted Round Robin', desc: 'Allows you to assign higher weight to more powerful servers.' },
    LC: { name: 'Least Connections', desc: 'Sends traffic to the server with the fewest active sessions.' },
    IPH: { name: 'IP Hash', desc: 'Uses the client IP to ensure a user consistently hits the same server.' },
  };

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Algorithm Simulator</h2>
      <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">Different algorithms solve different problems. Experiment with them below to see how traffic distribution patterns change.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Selection Logic</label>
            <select 
              value={algo}
              onChange={(e) => setAlgo(e.target.value as Algo)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="RR">Round Robin</option>
              <option value="WRR">Weighted Round Robin</option>
              <option value="LC">Least Connections</option>
              <option value="IPH">IP Hash</option>
            </select>

            <div className="mt-6">
              <h4 className="font-bold text-blue-400 mb-1">{algoInfo[algo].name}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{algoInfo[algo].desc}</p>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Simulate Client</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={clientIp} 
                  onChange={(e) => setClientIp(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono"
                  placeholder="IP Address"
                />
                <button 
                  onClick={() => setClientIp(`192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`)}
                  className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600"
                  title="Random IP"
                >🎲</button>
             </div>
             <button 
               onClick={processRequest}
               className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
             >
               🚀 Send New Request
             </button>
          </div>
        </div>

        {/* Visual Simulation */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 min-h-[400px]">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-6 tracking-widest text-center">Backend Server Group</h4>
          
          <div className="flex flex-col gap-8 items-center justify-center h-full">
            {servers.map((s) => {
              const isActive = history[0]?.server === s.id;
              return (
                <div 
                  key={s.id} 
                  className={`w-full max-w-sm flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isActive ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-xl shadow-blue-500/10' : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🖥️</span>
                    <div>
                      <p className="font-bold text-lg">Server {s.id}</p>
                      <div className="flex gap-3 text-[10px] font-mono text-slate-500">
                        <span>WEIGHT: {s.weight}</span>
                        <span>CONNS: {s.conns}</span>
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-xs animate-pulse">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      RECEIVING...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Logs */}
        <div className="lg:col-span-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Traffic Logs</h4>
          <div className="space-y-2 h-[450px] overflow-y-auto no-scrollbar font-mono text-[10px]">
            {history.length === 0 && (
              <p className="text-slate-600 text-center italic mt-10">No requests handled yet.</p>
            )}
            {history.map(entry => (
              <div key={entry.id} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center group">
                <span className="text-slate-500">{entry.ip}</span>
                <span className="text-slate-700">→</span>
                <span className="text-blue-400 font-bold group-hover:scale-110 transition-transform">SVR_{entry.server}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsTab;
