'use client';

import { useState } from 'react';
import api from '@/lib/api';

function Calculator({ propertyPrice, onClose }) {
  const [principal, setPrincipal] = useState(propertyPrice || 5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/emi/calculate', {
        principal: parseInt(principal), rate: parseFloat(rate), tenure: parseInt(tenure)
      });
      setResult(res.data);
    } catch {
      const p = parseInt(principal), r = parseFloat(rate) / 12 / 100, n = parseInt(tenure) * 12;
      const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      setResult({ monthlyEMI: emi, totalAmount: emi * n, totalInterest: emi * n - p });
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n?.toLocaleString()}`;
  };

  const principalPct = result ? Math.round((parseInt(principal) / result.totalAmount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-gray-900">💰 EMI Calculator</h3>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 text-xl leading-none">✕</button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
            <span className="text-sm font-bold text-primary">{fmt(parseInt(principal) || 0)}</span>
          </div>
          <input type="range" min="500000" max="100000000" step="100000" value={principal}
            onChange={e => { setPrincipal(e.target.value); setResult(null); }}
            className="w-full accent-primary" />
          <input type="number" value={principal} onChange={e => { setPrincipal(e.target.value); setResult(null); }}
            className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
            <span className="text-sm font-bold text-primary">{rate}%</span>
          </div>
          <input type="range" min="5" max="20" step="0.1" value={rate}
            onChange={e => { setRate(e.target.value); setResult(null); }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>20%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
            <span className="text-sm font-bold text-primary">{tenure} Years</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={tenure}
            onChange={e => { setTenure(e.target.value); setResult(null); }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>30 yrs</span></div>
        </div>

        <button onClick={calculate} disabled={loading}
          className="w-full button-primary py-3 rounded-xl disabled:opacity-60">
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>

        {result && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold text-primary">{fmt(result.monthlyEMI)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Principal</p>
                <p className="font-bold text-gray-800 text-sm">{fmt(parseInt(principal))}</p>
                <p className="text-xs text-green-600">{principalPct}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                <p className="font-bold text-gray-800 text-sm">{fmt(result.totalInterest)}</p>
                <p className="text-xs text-red-500">{100 - principalPct}%</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Payment ({tenure} years)</p>
              <p className="font-bold text-gray-900">{fmt(result.totalAmount)}</p>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="bg-primary h-full transition-all" style={{ width: `${principalPct}%` }} />
              <div className="bg-red-400 h-full flex-1" />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-primary font-medium">● Principal</span>
              <span className="text-red-400 font-medium">● Interest</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EMICalculator({ propertyPrice, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  if (onClose) return <Calculator propertyPrice={propertyPrice} onClose={onClose} />;

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition z-40 text-xl"
        title="EMI Calculator">
        💰
      </button>
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 shadow-2xl">
          <Calculator propertyPrice={propertyPrice} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
