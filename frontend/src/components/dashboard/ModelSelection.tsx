import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, ListFilter, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ModelSelection: React.FC = () => {
  const { darkMode } = useStore();
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['modelMetrics'],
    queryFn: () => api.getModelMetrics().then(r => r.data.models),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse py-4">
        <div className="h-6 w-36 bg-brand-gray/25 rounded"></div>
        <div className="h-44 bg-brand-gray/25 rounded-xl"></div>
        <div className="h-72 bg-brand-gray/25 rounded-xl"></div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold">
        Error loading classification performance metrics.
      </div>
    );
  }

  // Pre-formatted chart data comparing model performance
  const chartData = metrics.map((model) => ({
    name: model.type === 'ML' ? 'Classical ML' : model.type === 'GNN' ? 'GNN Graph' : 'Topology Graph',
    Accuracy: model.accuracy * 100,
    Precision: model.precision * 100,
    Recall: model.recall * 100,
    F1: model.f1_score * 100,
    'ROC-AUC': model.roc_auc * 100,
  }));

  const getPercent = (v: number) => `${(v * 100).toFixed(1)}%`;

  // Dynamic axis label and border stroke colors for dark/light mode compatibility
  const axisColor = darkMode ? '#8d99ae' : '#2b2d42';
  const gridColor = darkMode ? '#353535' : '#8d99ae';

  return (
    <div className="space-y-8 py-2 text-brand-dark dark:text-brand-light">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-brand-dark dark:text-white tracking-tight flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-brand-crimson dark:text-brand-red" />
            <span>Model Performance Matrix</span>
          </h2>
          <p className="text-brand-gray dark:text-brand-gray/80 text-xs mt-1 font-medium">
            Comparative evaluation results across model checkpoints on the validation cohort set.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#151622] border border-brand-gray/30 dark:border-brand-gray/10 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-crimson dark:text-brand-red shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active checkouts synced with MLflow</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: GNN Champion */}
        <div className="bg-white dark:bg-[#151622] border border-brand-crimson/30 dark:border-brand-crimson/10 p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 opacity-5">
            <Trophy className="w-24 h-24 text-brand-crimson" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-crimson bg-brand-crimson/10 border border-brand-crimson/20 px-2 py-0.5 rounded">
              Champion Model
            </span>
            <h3 className="text-sm font-bold text-brand-dark dark:text-white mt-2">Graph Neural Network</h3>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-xs text-brand-gray dark:text-brand-gray/60 font-medium">F1-Score Accuracy:</span>
            <span className="text-2xl font-black text-brand-crimson dark:text-brand-red font-mono">90.7%</span>
          </div>
        </div>

        {/* Card 2: Highest Precision */}
        <div className="bg-white dark:bg-[#151622] border border-brand-gray/20 dark:border-brand-gray/10 p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-gray dark:text-brand-light bg-brand-light dark:bg-brand-dark border border-brand-gray/20 dark:border-brand-gray/10 px-2 py-0.5 rounded">
              High Precision
            </span>
            <h3 className="text-sm font-bold text-brand-dark dark:text-white mt-2">GCN Node Classifier</h3>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-xs text-brand-gray dark:text-brand-gray/60 font-medium">Precision Score:</span>
            <span className="text-2xl font-black text-brand-dark dark:text-white font-mono">91.0%</span>
          </div>
        </div>

        {/* Card 3: Best Generalization */}
        <div className="bg-white dark:bg-[#151622] border border-brand-gray/20 dark:border-brand-gray/10 p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-gray dark:text-brand-light bg-brand-light dark:bg-brand-dark border border-brand-gray/20 dark:border-brand-gray/10 px-2 py-0.5 rounded">
              Top ROC-AUC
            </span>
            <h3 className="text-sm font-bold text-brand-dark dark:text-white mt-2">Ensemble Benchmark</h3>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-xs text-brand-gray dark:text-brand-gray/60 font-medium">Area under ROC:</span>
            <span className="text-2xl font-black text-brand-dark dark:text-white font-mono">95.8%</span>
          </div>
        </div>
      </div>

      {/* Structured Comparative Table with high contrast and colors */}
      <div className="bg-white dark:bg-[#151622] border border-brand-gray/20 dark:border-brand-gray/10 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-dark dark:bg-slate-950 border-b border-brand-gray/25 dark:border-brand-gray/10 text-white font-bold uppercase tracking-wider">
                <th className="p-3.5 pl-5">Model Type</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5 bg-white/10 dark:bg-white/5 text-brand-light">F1-Score</th>
                <th className="p-3.5">ROC-AUC</th>
                <th className="p-3.5">Validation Set</th>
                <th className="p-3.5 pr-5">Version Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray/15 dark:divide-brand-gray/10 text-brand-dark dark:text-brand-light">
              {metrics.map((model) => (
                <tr key={model.type} className="hover:bg-brand-light/50 dark:hover:bg-white/5 transition">
                  <td className="p-3.5 pl-5 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-crimson dark:text-brand-red" />
                    <span>
                      {model.type === 'ML' ? 'Classical Classifier (Random Forest)' : model.type === 'GNN' ? 'Graph Neural Network (GCN)' : 'Topology Degree Network'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-brand-dark dark:text-brand-light font-medium">{getPercent(model.accuracy)}</td>
                  <td className="p-3.5 font-mono text-brand-dark dark:text-brand-light font-medium">{getPercent(model.precision)}</td>
                  <td className="p-3.5 font-mono text-brand-dark dark:text-brand-light font-medium">{getPercent(model.recall)}</td>
                  <td className="p-3.5 font-mono font-black text-brand-crimson dark:text-brand-red bg-brand-crimson/5 dark:bg-brand-red/5">{getPercent(model.f1_score)}</td>
                  <td className="p-3.5 font-mono text-brand-dark dark:text-brand-light font-medium">{getPercent(model.roc_auc)}</td>
                  <td className="p-3.5 text-brand-gray dark:text-brand-gray/60 font-medium">{model.test_set_size?.toLocaleString() || 'N/A'} nodes</td>
                  <td className="p-3.5 pr-5 text-brand-gray dark:text-brand-gray/60 font-mono font-medium text-[11px]">{model.version || 'v1.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-white dark:bg-[#151622] border border-brand-gray/20 dark:border-brand-gray/10 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-brand-dark dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-crimson dark:text-brand-red" />
            <span>Statistical Comparison Chart</span>
          </span>
          <span className="text-[10px] text-brand-gray font-mono">Metrics Normalized (0-100)</span>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.15} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} />
              <YAxis stroke={axisColor} fontSize={10} domain={[70, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: darkMode ? '#151622' : '#2b2d42', 
                  borderColor: '#8d99ae', 
                  borderRadius: '8px' 
                }}
                labelStyle={{ fontWeight: 'bold', color: '#edf2f4', fontSize: '11px' }}
                itemStyle={{ color: '#ffffff', fontSize: '11px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
              <Bar dataKey="Accuracy" fill="#2b2d42" radius={[3, 3, 0, 0]} />
              <Bar dataKey="F1" fill="#ef233c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ROC-AUC" fill="#8d99ae" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default ModelSelection;
