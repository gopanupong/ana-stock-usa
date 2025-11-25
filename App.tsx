import React, { useState } from 'react';
import { AnalysisState, ValuationData } from './types';
import { analyzeStock } from './services/geminiService';
import AnalysisChart from './components/AnalysisChart';
import MetricsGrid from './components/MetricsGrid';
import ScenarioCards from './components/ScenarioCards';

function App() {
  const [ticker, setTicker] = useState('');
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    data: null,
    error: null,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setState({ loading: true, data: null, error: null });

    try {
      const result = await analyzeStock(ticker.toUpperCase());
      setState({ loading: false, data: result, error: null });
    } catch (err: any) {
      setState({ 
        loading: false, 
        data: null, 
        error: err.message || "Something went wrong" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Damodaran<span className="text-blue-600">Analyzer</span>
              </h1>
            </div>
            <div className="hidden md:block text-sm text-slate-500">
              Valuation inspired by Aswath Damodaran
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Search Section */}
        <div className="max-w-xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            ค้นหามูลค่าที่แท้จริงของหุ้น USA
          </h2>
          <p className="text-slate-600 mb-8">
            วิเคราะห์ Fair Value, Bear Case และ Best Case ด้วย AI <br/>
            โดยอิงหลักการ Valuation ของศาสตราจารย์ Aswath Damodaran
          </p>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="ใส่ชื่อหุ้น (เช่น AAPL, MSFT, TSLA)"
              className="w-full h-14 pl-6 pr-32 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-lg outline-none transition-all uppercase text-red-600 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={state.loading}
              className="absolute right-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  วิเคราะห์...
                </span>
              ) : (
                "ค้นหา"
              )}
            </button>
          </form>
          {state.error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              ⚠️ {state.error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {state.data && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Header Data */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{state.data.ticker}</h2>
                <p className="text-slate-500">{state.data.companyName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Estimated Current Price</p>
                <div className="text-3xl font-mono font-bold text-slate-800">
                  {state.data.currency} {state.data.currentPriceEstimate.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Data as of: {state.data.valuationDate}</p>
              </div>
            </div>

            {/* Valuation Cards */}
            <ScenarioCards data={state.data} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2">
                 <AnalysisChart data={state.data} />
              </div>
              
              {/* Summary Text */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>📝</span> AI Summary
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {state.data.summary}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">
                    *หมายเหตุ: ผลลัพธ์นี้สร้างโดย AI (Gemini) โดยใช้แบบจำลองทางการเงิน การลงทุนมีความเสี่ยง โปรดใช้วิจารณญาณและตรวจสอบข้อมูลจริงจากแหล่งอื่นประกอบ
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Damodaran Style Assumptions</h3>
              <MetricsGrid metrics={state.data.metrics} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;