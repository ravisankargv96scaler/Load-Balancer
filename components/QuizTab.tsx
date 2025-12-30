
import React, { useState } from 'react';

const questions = [
  {
    id: 1,
    text: "Which algorithm ensures a specific user consistently connects to the same backend server?",
    options: ["Round Robin", "Least Connections", "IP Hash", "Weighted Random"],
    answerIndex: 2,
    explanation: "IP Hash uses the client's IP address to map them to a specific server, ensuring 'Session Persistence'."
  },
  {
    id: 2,
    text: "What is the primary purpose of a 'Health Check' in a Load Balancer?",
    options: ["To check server CPU temperature", "To ensure the server is still alive and handling requests", "To measure network speed", "To update the server software"],
    answerIndex: 1,
    explanation: "Health checks (heartbeats) tell the LB if a server is functional. If it fails, the LB stops sending it traffic."
  },
  {
    id: 3,
    text: "True or False: A Layer 4 Load Balancer can route traffic based on the HTTP URL path (e.g. /images).",
    options: ["True", "False"],
    answerIndex: 1,
    explanation: "False. Layer 4 only sees IP and Port. Inspecting URL paths requires a Layer 7 (Application) Load Balancer."
  }
];

const QuizTab: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (idx === questions[currentIdx].answerIndex) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setShowResult(false);
    setQuizFinished(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Summary & Knowledge Check</h2>
        <div className="flex justify-center gap-4 mb-6">
           <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Scalability</p>
              <p className="text-lg font-bold">Add capacity easily</p>
           </div>
           <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Availability</p>
              <p className="text-lg font-bold">No single point of failure</p>
           </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-mono text-blue-400">QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span className="text-xs font-mono text-slate-500">SCORE: {score}</span>
          </div>

          <h3 className="text-xl font-bold mb-8 leading-tight">{questions[currentIdx].text}</h3>

          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, i) => {
              let color = 'bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-300';
              if (showResult) {
                if (i === questions[currentIdx].answerIndex) color = 'bg-green-600/20 border-green-500 text-green-400';
                else if (i === selectedIdx) color = 'bg-red-600/20 border-red-500 text-red-400';
                else color = 'bg-slate-800 border-slate-700 opacity-50';
              }
              return (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${color}`}
                >
                  {opt}
                  {showResult && i === questions[currentIdx].answerIndex && <span>✓</span>}
                  {showResult && i === selectedIdx && i !== questions[currentIdx].answerIndex && <span>✗</span>}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 mb-6">
                <p className="text-sm leading-relaxed text-slate-300">
                  <span className="font-bold text-blue-400 uppercase text-[10px] block mb-1">Explanation</span>
                  {questions[currentIdx].explanation}
                </p>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center shadow-2xl">
           <div className="text-6xl mb-6">🎓</div>
           <h3 className="text-3xl font-bold mb-2">Quiz Complete!</h3>
           <p className="text-slate-400 mb-8">You scored <span className="text-blue-400 font-bold">{score} out of {questions.length}</span>.</p>
           
           <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8 text-left">
              <h4 className="font-bold text-sm mb-4 uppercase text-slate-500 tracking-widest">Next Steps</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                   <span className="text-green-400">✓</span> 
                   Explore Nginx or HAProxy configuration basics.
                </li>
                <li className="flex gap-3">
                   <span className="text-green-400">✓</span> 
                   Learn about "Global Server Load Balancing" (GSLB).
                </li>
                <li className="flex gap-3">
                   <span className="text-green-400">✓</span> 
                   Study the "Thundering Herd" problem in distributed systems.
                </li>
              </ul>
           </div>

           <button 
             onClick={restart}
             className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-slate-700"
           >
             Try Again
           </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
