
import React, { useState } from 'react';

const steps = [
  { 
    title: '1. Traffic Reception', 
    desc: 'The client sends an HTTP request to the Load Balancer\'s Public IP address.', 
    icon: '📩',
    details: 'The LB receives connections on standard ports like 80 (HTTP) or 443 (HTTPS).'
  },
  { 
    title: '2. Decision Logic', 
    desc: 'The LB chooses which backend server should handle this specific request.', 
    icon: '🧠',
    details: 'This choice is based on configured algorithms like Round Robin or Least Connections.'
  },
  { 
    title: '3. Backend Forwarding', 
    desc: 'The LB opens a connection to the selected server and forwards the original request.', 
    icon: '➡️',
    details: 'This often happens over a private, high-speed internal network.'
  },
  { 
    title: '4. Response Handling', 
    desc: 'The backend server processes the request and sends the response back via the LB to the client.', 
    icon: '🔙',
    details: 'The LB might compress the response or provide SSL termination here.'
  }
];

const HowItWorksTab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => (prev + 1) % steps.length);
  const reset = () => setCurrentStep(0);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 text-center max-center">
        <h2 className="text-3xl font-bold mb-4">The Request Journey</h2>
        <p className="text-slate-400">See exactly what happens when a packet hits the network edge.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Visualization area */}
        <div className="flex-1 bg-slate-950 rounded-2xl p-8 border border-slate-800 relative h-[400px]">
          <div className="absolute inset-0 flex items-center justify-between px-12">
            
            {/* Client */}
            <div className="z-10 text-center">
              <div className={`p-4 bg-slate-800 rounded-xl border-2 ${currentStep === 0 ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700'}`}>
                <span className="text-3xl">💻</span>
              </div>
              <p className="text-xs mt-2 font-bold text-slate-500">CLIENT</p>
            </div>

            {/* Load Balancer */}
            <div className="z-10 text-center flex flex-col items-center">
              <div className={`p-4 rounded-full bg-blue-600 shadow-xl border-4 border-slate-900 transition-all ${currentStep === 1 ? 'scale-125' : ''}`}>
                {currentStep === 1 ? (
                   <svg className="w-8 h-8 animate-spin text-white" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4V2A10,10,0,0,0,2,12H4A8,8,0,0,1,12,4Z"/></svg>
                ) : <span className="text-2xl">⚖️</span>}
              </div>
              <p className="text-xs mt-2 font-bold text-blue-500 uppercase tracking-widest">Load Balancer</p>
            </div>

            {/* Backend */}
            <div className="z-10 text-center">
              <div className={`p-4 bg-slate-800 rounded-xl border-2 ${currentStep === 3 ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-slate-700'}`}>
                <span className="text-3xl">🖥️</span>
              </div>
              <p className="text-xs mt-2 font-bold text-slate-500">BACKEND</p>
            </div>

          </div>

          {/* Animation Overlays */}
          {/* Step 1: Client to LB */}
          {currentStep === 1 && (
            <div className="absolute top-1/2 left-[15%] w-[35%] h-1 bg-blue-500/20 overflow-hidden -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-400 rounded-full shadow-lg absolute left-0 animate-[ping_1s_infinite] top-[-6px]" />
                <div className="packet-flow" style={{ animation: 'moveRight 0.8s infinite' }} />
            </div>
          )}

          {/* Step 3: LB to Backend */}
          {currentStep === 2 && (
            <div className="absolute top-1/2 left-[50%] w-[35%] h-1 bg-blue-500/20 overflow-hidden -translate-y-1/2">
                <div className="packet-flow" style={{ animation: 'moveRight 0.8s infinite' }} />
            </div>
          )}

           {/* Step 4: Backend back to Client (simplified) */}
           {currentStep === 3 && (
            <div className="absolute top-1/2 left-[15%] w-[70%] h-1 bg-green-500/20 overflow-hidden -translate-y-1/2">
                <div className="packet-flow" style={{ animation: 'moveLeft 1.2s infinite', backgroundColor: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex-1">
             <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl bg-slate-900 p-3 rounded-xl">{steps[currentStep].icon}</span>
                <div>
                  <h3 className="font-bold text-xl">{steps[currentStep].title}</h3>
                  <p className="text-blue-400 text-xs font-mono">STEP {currentStep + 1} OF 4</p>
                </div>
             </div>
             <p className="text-slate-300 mb-4">{steps[currentStep].desc}</p>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
               <p className="text-xs text-slate-500 leading-relaxed italic">{steps[currentStep].details}</p>
             </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={reset}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm border border-slate-700"
             >
                Reset
             </button>
             <button 
                onClick={nextStep}
                className="flex-[2] px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-900/20"
             >
                {currentStep === 3 ? 'Start Over' : 'Next Step →'}
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes moveRight {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes moveLeft {
          0% { left: 100%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HowItWorksTab;
