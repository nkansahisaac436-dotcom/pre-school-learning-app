import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, RefreshCw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const ParentalGateModal: React.FC = () => {
  const { isParentGateOpen, closeParentGate, enterParentDashboard } = useApp();

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate random math problem suitable for adults
  const generateProblem = () => {
    const a = Math.floor(Math.random() * 8) + 4; // 4 to 11
    const b = Math.floor(Math.random() * 8) + 3; // 3 to 10
    setNum1(a);
    setNum2(b);
    setAnswerInput('');
    setErrorMsg('');
  };

  useEffect(() => {
    if (isParentGateOpen) {
      generateProblem();
    }
  }, [isParentGateOpen]);

  if (!isParentGateOpen) return null;

  const correctAnswer = num1 + num2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answerInput, 10) === correctAnswer) {
      soundEffects.playPop();
      enterParentDashboard();
    } else {
      setErrorMsg('Incorrect answer. Please try again.');
      soundEffects.playGentleBoing();
      generateProblem();
    }
  };

  const handleKeypadPress = (val: string) => {
    soundEffects.playPop();
    if (val === 'clear') {
      setAnswerInput('');
      return;
    }
    if (answerInput.length < 3) {
      setAnswerInput((prev) => prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-slate-700 relative text-gray-800">
        {/* Close Button */}
        <button
          onClick={closeParentGate}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">Parent & Teacher Gate</h2>
            <p className="text-xs text-gray-500">Please solve the problem to enter settings</p>
          </div>
        </div>

        {/* Problem Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 mb-5 text-center">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Adult Verification
          </div>
          <div className="text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
            <span>{num1}</span>
            <span className="text-amber-500">+</span>
            <span>{num2}</span>
            <span className="text-slate-400">=</span>
            <span className="inline-block min-w-14 px-3 py-1 bg-white border-2 border-amber-400 rounded-xl text-amber-600 shadow-inner">
              {answerInput || '?'}
            </span>
          </div>

          {errorMsg && <p className="text-xs font-bold text-rose-500 mt-2">{errorMsg}</p>}
        </div>

        {/* Numerical Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0'].map((key) => {
            if (key === 'clear') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress('clear')}
                  className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 active:scale-95 transition"
                >
                  Clear
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeypadPress(key)}
                className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl font-black rounded-xl border border-slate-200 active:scale-95 transition"
              >
                {key}
              </button>
            );
          })}
          <button
            type="button"
            onClick={generateProblem}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 flex items-center justify-center active:scale-95 transition"
            title="Get new question"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeParentGate}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Back to Kids App
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answerInput}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition ${
              answerInput
                ? 'bg-amber-500 hover:bg-amber-600 border-2 border-amber-600'
                : 'bg-gray-300 cursor-not-allowed border-2 border-gray-300'
            }`}
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
